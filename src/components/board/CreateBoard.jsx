import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardStore } from "../../store/board.store"
import "../../styles/CreateBoard.css"


function CreateBoard() {
  const navigate = useNavigate()
  const { createBoard } = useBoardStore()

  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("📋")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const emojis = [
    "📋", "📝", "📊", "📈", "📉", "💼", "🎯", "🚀", 
    "💡", "🔥", "⚡", "🌟", "✨", "🎨", "🎭", "🎪",
    "🎬", "🎮", "🎲", "🎯", "🏆", "🥇", "🏅", "🎖️",
    "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📹", "🎥",
    "🏠", "🏢", "🏭", "🏗️", "🏰", "🏯", "🗼", "🌉"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Board name is required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await createBoard({ 
        name: name.trim(),
        emoji: emoji // Send selected emoji to backend
      })

      // Navigate directly to new board
      navigate(`/board/${res.board._id}`)

    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create board")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-board-container">
      <div className="create-board-wrapper">
        <div className="create-board-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back</span>
          </button>
          <h1>Create New Board</h1>
          <p>Set up your board to start organizing tasks</p>
        </div>

        <div className="create-board-card">
          <form onSubmit={handleSubmit} className="create-board-form">
            {/* Board Icon Section */}
            <div className="board-icon-section"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <label className="board-icon-label">Board Icon</label>
              <div className="board-icon-selection">
                <button
                  type="button"
                  className="selected-emoji-button"
                >
                  <span className="emoji-display">{emoji}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="emoji-hint">
                  <p>Choose an icon for your board</p>
                </div>

                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-picker-header">
                      <span>Select Icon</span>
                      <button
                        type="button"
                        className="emoji-close"
                        onClick={() => setShowEmojiPicker(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className="emoji-grid">
                      {emojis.map((e) => (
                        <button
                          key={e}
                          type="button"
                          className={`emoji-option ${emoji === e ? 'selected' : ''}`}
                          onClick={() => {
                            setEmoji(e)
                            setShowEmojiPicker(false)
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Board Name Input */}
            <div className="form-group">
              <label htmlFor="boardName">Board Name</label>
              <input
                type="text"
                id="boardName"
                name="boardName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Enter board name"
                maxLength={50}
                required
              />
              <div className="char-count">
                {name.length}/50 characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 13V13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Preview Section */}
            <div className="board-preview">
              <label className="preview-label">Preview</label>
              <div className="board-preview-card">
                <div className="preview-icon">{emoji}</div>
                <div className="preview-content">
                  <h3>{name || "Your board name"}</h3>
                  <p>Created by you • 0 tasks</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Create Board</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="create-board-footer">
          <p>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7V11M8 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            You can invite team members and customize your board settings after creation
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateBoard