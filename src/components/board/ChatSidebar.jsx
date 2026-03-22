import { useEffect, useRef, useState, useCallback } from "react"
import { useChatStore } from "../../store/chat.store"
import { useAuthStore } from "../../store/auth.store"
import { connectSocket } from "../../socket/socket"
import "../../styles/ChatSidebar.css"

const TYPING_STOP_DELAY = 1500

function ChatSidebar({ boardId, isOpen, onClose }) {
  const { user } = useAuthStore()
  const {
    messages,
    typingUsers,
    hasMore,
    loadingHistory,
    fetchChatHistory,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    markRead,
    subscribeToBoard,
    unsubscribeFromBoard,
    resetChat,
  } = useChatStore()

  const [text, setText] = useState("")
  const bottomRef = useRef(null)
  const topRef = useRef(null)
  const typingTimerRef = useRef(null)
  const isTypingRef = useRef(false)

  // Connect socket + subscribe
  useEffect(() => {
    if (!isOpen || !boardId || !user) return

    connectSocket(user._id)
    subscribeToBoard(boardId)
    fetchChatHistory(boardId)

    return () => {
      unsubscribeFromBoard(boardId)
      resetChat()
    }
  }, [isOpen, boardId, user?._id])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark visible messages as read
  useEffect(() => {
    if (!messages.length || !user) return
    const unread = messages
      .filter((m) => m.sender?._id !== user._id && !m.readBy?.includes(user._id))
      .map((m) => m._id)
    if (unread.length) markRead(boardId, unread, user._id)
  }, [messages])

  // Infinite scroll — load older messages when scrolled to top
  const handleScroll = useCallback(
    (e) => {
      if (e.target.scrollTop < 60 && hasMore && !loadingHistory) {
        fetchChatHistory(boardId, { prepend: true })
      }
    },
    [hasMore, loadingHistory, boardId]
  )

  const handleTyping = (e) => {
    setText(e.target.value)
    if (!isTypingRef.current) {
      isTypingRef.current = true
      sendTypingStart(boardId, user._id)
    }
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      sendTypingStop(boardId, user._id)
    }, TYPING_STOP_DELAY)
  }

  const handleSend = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(boardId, trimmed, user._id)
    setText("")
    clearTimeout(typingTimerRef.current)
    isTypingRef.current = false
    sendTypingStop(boardId, user._id)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e)
  }

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const isOwnMessage = (msg) => msg.sender?._id === user?._id

  if (!isOpen) return null

  return (
    <div className="chat-sidebar-wrapper">
      <div className="sidebar-overlay" onClick={onClose} />
      <div className="chat-sidebar">
        {/* Header */}
        <div className="chat-sidebar-header">
          <h3>Board Chat</h3>
          <button className="chat-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages" onScroll={handleScroll}>
          {loadingHistory && (
            <div className="chat-loading">
              <div className="chat-spinner" />
            </div>
          )}

          {messages.map((msg, i) => {
            const own = isOwnMessage(msg)
            const prevMsg = messages[i - 1]
            const showAvatar = !own && msg.sender?._id !== prevMsg?.sender?._id

            return (
              <div key={msg._id} className={`chat-message ${own ? "own" : "other"}`}>
                {showAvatar && (
                  <img
                    className="chat-avatar"
                    src={msg.sender?.profilePic || "/default-avatar.png"}
                    alt={msg.sender?.userName}
                  />
                )}
                {!showAvatar && !own && <div className="chat-avatar-spacer" />}
                <div className="chat-bubble-group">
                  {showAvatar && (
                    <span className="chat-username">{msg.sender?.userName}</span>
                  )}
                  <div className="chat-bubble">
                    <span className="chat-text">{msg.msg}</span>
                    <span className="chat-time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="chat-typing-indicator">
              <span className="typing-dots">
                <span /><span /><span />
              </span>
              <span className="typing-text">
                {typingUsers.length === 1 ? "Someone is typing..." : "Several people are typing..."}
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form className="chat-input-form" onSubmit={handleSend}>
          <textarea
            className="chat-input"
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Message the board..."
            rows={1}
            maxLength={1000}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!text.trim()}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16.5 1.5L8.25 9.75M16.5 1.5L11.25 16.5L8.25 9.75L1.5 6.75L16.5 1.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatSidebar