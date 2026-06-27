import { useEffect, useRef, useState, useCallback } from "react"
import { useChatStore } from "../../store/chat.store"
import { useAuthStore } from "../../store/auth.store"
import "../../styles/Chatsidebar.css"

const TYPING_STOP_DELAY = 1500

const SingleTick = () => (
  <svg className="tick-icon tick-sent" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DoubleTick = ({ read }) => (
  <svg className={`tick-icon ${read ? "tick-read" : "tick-sent"}`} width="18" height="10" viewBox="0 0 18 10" fill="none">
    <path d="M1 5L4.5 8.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 5L9.5 8.5L17 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChatAvatar = ({ sender }) => {
  const [imgError, setImgError] = useState(false)

  if (sender?.profilePic && !imgError) {
    return (
      <img
        className="chat-avatar"
        src={sender.profilePic}
        alt={sender?.userName}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className="chat-avatar chat-avatar-default">
      {sender?.userName?.[0]?.toUpperCase() || "?"}
    </div>
  )
}

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
  const typingTimerRef = useRef(null)
  const isTypingRef = useRef(false)

  useEffect(() => {
    if (!isOpen || !boardId || !user?._id) return
    subscribeToBoard(boardId)
    fetchChatHistory(boardId)
    return () => {
      unsubscribeFromBoard(boardId)
      resetChat()
    }
  }, [isOpen, boardId, user?._id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!messages.length || !user?._id) return
    const unread = messages
      .filter((m) => m.sender?._id !== user._id && !m.readBy?.includes(user._id))
      .map((m) => m._id)
    if (unread.length) markRead(boardId, unread)
  }, [messages])

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
      sendTypingStart(boardId)
    }
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      sendTypingStop(boardId)
    }, TYPING_STOP_DELAY)
  }

  const handleSend = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(boardId, trimmed)
    setText("")
    clearTimeout(typingTimerRef.current)
    isTypingRef.current = false
    sendTypingStop(boardId)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e)
  }

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const isOwnMessage = (msg) => msg.sender?._id === user?._id

  const getTickStatus = (msg) => {
    const readBy = msg.readBy || []
    const othersRead = readBy.filter((id) => id !== user?._id)
    if (othersRead.length > 0) return "read"
    if (readBy.includes(user?._id)) return "sent"
    return "sending"
  }

  if (!isOpen) return null

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h3>Board Chat</h3>
        <button className="chat-close-btn" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="chat-messages" onScroll={handleScroll}>
        {loadingHistory && (
          <div className="chat-loading">
            <div className="chat-spinner" />
          </div>
        )}

        {messages.length === 0 && !loadingHistory && (
          <div className="chat-empty">
            <p>No messages yet. Say something!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const own = isOwnMessage(msg)
          const prevMsg = messages[i - 1]
          const showAvatar = !own && msg.sender?._id !== prevMsg?.sender?._id
          const newSender = msg.sender?._id !== prevMsg?.sender?._id
          const tickStatus = own ? getTickStatus(msg) : null

          return (
            <div
              key={msg._id}
              className={`chat-message ${own ? "own" : "other"} ${newSender ? "new-sender" : ""}`}
            >
              {!own && (
                showAvatar
                  ? <ChatAvatar sender={msg.sender} />
                  : <div className="chat-avatar-spacer" />
              )}

              <div className="chat-bubble-group">
                {showAvatar && !own && (
                  <span className="chat-username">{msg.sender?.userName}</span>
                )}

                <div className="chat-bubble">
                  <span className="chat-text">{msg.msg}</span>
                  <div className="chat-meta">
                    <span className="chat-time">{formatTime(msg.createdAt)}</span>
                    {own && (
                      <span className="chat-ticks">
                        {tickStatus === "sending" && <SingleTick />}
                        {tickStatus === "sent"    && <DoubleTick read={false} />}
                        {tickStatus === "read"    && <DoubleTick read={true}  />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {typingUsers.length > 0 && (
          <div className="chat-message other new-sender">
            <div className="chat-avatar-spacer" />
            <div className="chat-bubble-group">
              <div className="chat-bubble typing-bubble">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

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
        <button type="submit" className="chat-send-btn" disabled={!text.trim()}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M16.5 1.5L8.25 9.75M16.5 1.5L11.25 16.5L8.25 9.75L1.5 6.75L16.5 1.5Z"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChatSidebar