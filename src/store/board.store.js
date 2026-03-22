import { create } from "zustand"
import boardApi from "../api/board.api"
import { useAuthStore } from "./auth.store"

const useBoardStore = create((set) => ({
  boards: [],
  pendingBoards: [],
  loading: false,
  error: null,

  fetchBoards: async () => {
    try {
      set({ loading: true, error: null })

      const token = useAuthStore.getState().token

      const approvedRes = await boardApi.getMyBoards(token)
      const pendingRes = await boardApi.getPendingBoards(token)

      set({
        boards: approvedRes.boards || [],
        pendingBoards: pendingRes.boards || [],
        loading: false
      })
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Failed to fetch boards",
        loading: false
      })
    }
  },

  createBoard: async (boardDetails) => {
    try {
      const token = useAuthStore.getState().token
      const res = await boardApi.createBoard(boardDetails, token)

      set((state) => ({
        boards: [res.board, ...state.boards]
      }))

      return res
    } catch (err) {
      throw err
    }
  },

  renameBoard: async (boardId, newName) => {   
    try {
      const token = useAuthStore.getState().token
      const res = await boardApi.renameBoard(token, boardId, { name: newName })

    
      set((state) => ({
        boards: state.boards.map((board) =>
          board._id === boardId ? { ...board, name: newName } : board
        )
      }))

      return res
    } catch (err) {
      throw err
    }
  },

  clearBoards: () => {
    set({
      boards: [],
      pendingBoards: [],
      error: null
    })
  }
}))

export { useBoardStore }