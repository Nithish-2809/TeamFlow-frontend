import { useState, useEffect, useRef } from "react"
import { useAuthStore } from "../auth/auth.store"
import { useBoardPageStore } from "../boardPage/boardPage.store"
import "../styles/RenameBoardModal.css"

const RenameBoardModal = ({ isOpen, onClose, boardId, currentName, onSuccess }) => {
  const [newName, setNewName] = useState(currentName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)
  
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setNewName(currentName)
      setError("")
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentName])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const trimmedName = newName.trim()
    
    if (!trimmedName) {
      setError("Board name cannot be empty")
      return
    }
    
    if (trimmedName === currentName) {
      onClose()
      return
    }

    if (trimmedName.length > 50) {
      setError("Board name must be 50 characters or less")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:2231/api/boards/${boardId}/rename`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: trimmedName })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to rename board')
      }

      // Update local state
      const { boardDetails } = useBoardPageStore.getState()
      if (boardDetails) {
        useBoardPageStore.setState({
          boardDetails: {
            ...boardDetails,
            name: trimmedName
          }
        })
      }

      onSuccess(trimmedName)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rename-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="rename-modal-header">
          <div className="rename-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Rename Board</h2>
          <button className="rename-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rename-modal-content">
          <div className="input-group">
            <label htmlFor="board-name">Board Name</label>
            <input
              ref={inputRef}
              id="board-name"
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                setError("")
              }}
              placeholder="Enter board name"
              maxLength={50}
              autoComplete="off"
            />
            <div className="input-footer">
              {error && <span className="input-error">{error}</span>}
              <span className="character-count">{newName.length}/50</span>
            </div>
          </div>

          <div className="rename-modal-actions">
            <button 
              type="button"
              className="modal-button modal-button-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="modal-button modal-button-primary"
              disabled={loading || !newName.trim() || newName.trim() === currentName}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Renaming...</span>
                </>
              ) : (
                'Rename Board'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RenameBoardModal