import { create } from "zustand"
import chatApi from "../api/chat.api"
import { getSocket } from "../socket/socket"
import { useAuthStore } from "./auth.store"

export const useChatStore = create((set, get) => ({
  // ── state ──────────────────────────────────────────
  messages: [],           // active board chat messages
  boardChats: [],         // sidebar board chat list
  dmChats: [],            // sidebar DM list
  typingUsers: [],        // userIds currently typing in active board
  hasMore: true,          // pagination
  oldestCursor: null,     // cursor for loading older messages
  loadingHistory: false,
  loadingChats: false,
  activeBoardId: null,

  // ── REST ───────────────────────────────────────────
  fetchChatHistory: async (boardId, { prepend = false } = {}) => {
    const token = useAuthStore.getState().token
    const { oldestCursor, messages } = get()

    set({ loadingHistory: true })

    try {
      const params = { limit: 40 }
      if (prepend && oldestCursor) params.cursor = oldestCursor

      const res = await chatApi.getChatHistory(token, boardId, params)

      // Backend returns newest-first — reverse for display
      const ordered = [...res.messages].reverse()

      if (prepend) {
        set({
          messages: [...ordered, ...messages],
          hasMore: res.messages.length === 40,
          oldestCursor: ordered[0]?.createdAt ?? oldestCursor,
          loadingHistory: false,
        })
      } else {
        set({
          messages: ordered,
          hasMore: res.messages.length === 40,
          oldestCursor: ordered[0]?.createdAt ?? null,
          loadingHistory: false,
          activeBoardId: boardId,
        })
      }
    } catch (err) {
      console.error("fetchChatHistory error:", err)
      set({ loadingHistory: false })
    }
  },

  fetchBoardChats: async () => {
    const token = useAuthStore.getState().token
    set({ loadingChats: true })
    try {
      const res = await chatApi.getBoardChats(token)
      set({ boardChats: res.chats || [], loadingChats: false })
    } catch (err) {
      console.error("fetchBoardChats error:", err)
      set({ loadingChats: false })
    }
  },

  fetchDmChats: async () => {
    const token = useAuthStore.getState().token
    try {
      const res = await chatApi.getDmChats(token)
      set({ dmChats: res.chats || [] })
    } catch (err) {
      console.error("fetchDmChats error:", err)
    }
  },

  // ── socket actions ─────────────────────────────────
  sendMessage: (boardId, content, userId) => {
    getSocket().emit("chat:send", { content, boardId, userId })
  },

  sendDm: (boardId, receiverId, content) => {
    getSocket().emit("chat:send:dm", { content, receiverId, boardId })
  },

  markRead: (boardId, messageIds, userId) => {
    if (!messageIds.length) return
    getSocket().emit("chat:markRead", { messageIds, boardId, userId })
  },

  sendTypingStart: (boardId, userId) => {
    getSocket().emit("chat:typing:start", { boardId, userId })
  },

  sendTypingStop: (boardId, userId) => {
    getSocket().emit("chat:typing:stop", { boardId, userId })
  },

  // ── socket listeners (call once per board) ─────────
  subscribeToBoard: (boardId) => {
    const socket = getSocket()

    socket.emit("joinBoard", boardId)

    socket.on("chat:newMessage", ({ message }) => {
      const { activeBoardId } = get()
      if (message.boardId !== activeBoardId && message.boardId !== boardId) return
      set((state) => ({ messages: [...state.messages, message] }))
    })

    socket.on("chat:typing", ({ userId, isTyping }) => {
      set((state) => ({
        typingUsers: isTyping
          ? [...new Set([...state.typingUsers, userId])]
          : state.typingUsers.filter((id) => id !== userId),
      }))
    })

    socket.on("chat:updateRead", ({ messageIds, readerId }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id)
            ? { ...msg, readBy: [...new Set([...(msg.readBy || []), readerId])] }
            : msg
        ),
      }))
    })

    socket.on("dm:newMessage", ({ message }) => {
      set((state) => ({ dmChats: state.dmChats })) // trigger re-fetch or optimistic update
    })
  },

  unsubscribeFromBoard: (boardId) => {
    const socket = getSocket()
    socket.emit("leaveBoard", boardId)
    socket.off("chat:newMessage")
    socket.off("chat:typing")
    socket.off("chat:updateRead")
    socket.off("dm:newMessage")
  },

  resetChat: () => {
    set({
      messages: [],
      typingUsers: [],
      hasMore: true,
      oldestCursor: null,
      loadingHistory: false,
      activeBoardId: null,
    })
  },
}))