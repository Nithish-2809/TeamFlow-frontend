import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardStore } from "../board/board.store"
import "../styles/Home.css"

// Icon color mapping
const iconColors = {
  0: { bg: '#E8F5E9', icon: '⚙️' },
  1: { bg: '#E3F2FD', icon: '📱' },
  2: { bg: '#FFF3E0', icon: '📢' },
  3: { bg: '#FCE4EC', icon: '🗄️' },
  4: { bg: '#F3E5F5', icon: '🎨' },
  5: { bg: '#E0F2F1', icon: '💼' },
}

function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(null)

  const {
    boards,
    pendingBoards,
    fetchBoards,
    loading,
    error
  } = useBoardStore()

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.board-menu-button')) {
        setMenuOpen(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Sort by latest updated
  const sortedBoards = [...boards].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  const handleMenuToggle = (e, boardId) => {
    e.stopPropagation()
    setMenuOpen(menuOpen === boardId ? null : boardId)
  }

  const handleLeaveBoard = (e, boardId) => {
    e.stopPropagation()
    // TODO: Implement leave board logic
    console.log("Leave board:", boardId)
    setMenuOpen(null)
  }

  const handleBoardDetails = (e, boardId) => {
    e.stopPropagation()
    navigate(`/board/${boardId}/details`)
    setMenuOpen(null)
  }

  const getIconForBoard = (index) => {
    const colorIndex = index % Object.keys(iconColors).length
    return iconColors[colorIndex]
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const updated = new Date(date)
    const diffInMs = now - updated
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 60) {
      return `Updated ${diffInMins} mins ago`
    } else if (diffInHours < 24) {
      return `Updated ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
      return `Updated ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return `Updated ${updated.toLocaleDateString()}`
    }
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your boards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-state">
          <div className="error-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="error-text">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-wrapper">
        {/* Header with Create Button */}
        <div className="home-header">
          <h1>My Boards</h1>
          <button
            className="create-board-button-top"
            onClick={() => navigate("/create-board")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span>Create Board</span>
          </button>
        </div>

        {/* Active Boards Section */}
        <div className="boards-section">
          <div className="boards-grid">
            {sortedBoards.map((board, index) => {
              const iconStyle = getIconForBoard(index)
              return (
                <div
                  key={board._id}
                  className="board-card"
                  onClick={() => navigate(`/board/${board._id}`)}
                >
                  <button
                    className="board-menu-button"
                    onClick={(e) => handleMenuToggle(e, board._id)}
                    aria-label="Board options"
                  >
                    ⋮
                  </button>

                  {menuOpen === board._id && (
                    <div className="board-menu-dropdown">
                      <button
                        className="menu-option"
                        onClick={(e) => handleBoardDetails(e, board._id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Board Details
                      </button>
                      <button
                        className="menu-option danger"
                        onClick={(e) => handleLeaveBoard(e, board._id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Leave Board
                      </button>
                    </div>
                  )}

                  <div className="board-card-header">
                    <div className="board-icon" style={{ background: iconStyle.bg }}>
                      {iconStyle.icon}
                    </div>
                    <div className="board-card-title-section">
                      <h3 className="board-card-title">{board.name}</h3>
                      <p className="board-task-count">{board.tasksCount || 0} tasks</p>
                    </div>
                    {board.isAdmin && (
                      <div className="board-badges">
                        <span className="badge badge-red">2</span>
                        <span className="badge badge-gray">2</span>
                      </div>
                    )}
                  </div>

                  <div className="board-members">
                    <div className="members-avatars">
                      {board.leader?.profilePic ? (
                        <img
                          src={board.leader.profilePic}
                          alt={board.leader.userName}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar-placeholder">
                          {getInitials(board.leader?.userName)}
                        </div>
                      )}
                      {/* Add more member avatars here if available */}
                    </div>
                    <span className="admin-label">You Admin</span>
                  </div>

                  <p className="board-timestamp">
                    {formatTimeAgo(board.updatedAt)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pending Boards Section */}
        {pendingBoards.length > 0 && (
          <div className="pending-section">
            <div className="section-header">
              <h2 className="section-title">Pending ({pendingBoards.length})</h2>
              <button className="section-menu-button" aria-label="Section options">
                ⋮
              </button>
            </div>

            <div className="pending-cards-grid">
              {pendingBoards.map((board, index) => {
                const iconStyle = getIconForBoard(index + sortedBoards.length)
                return (
                  <div key={board._id} className="pending-card">
                    <span className="pending-badge">Pending Approval</span>

                    <div className="pending-card-header">
                      <div className="board-icon" style={{ background: iconStyle.bg }}>
                        {iconStyle.icon}
                      </div>
                      <div className="pending-card-title-section">
                        <h3 className="pending-card-title">{board.name}</h3>
                        <p className="board-task-count">0 tasks</p>
                      </div>
                    </div>

                    <div className="board-members">
                      <div className="members-avatars">
                        {board.leader?.profilePic ? (
                          <img
                            src={board.leader.profilePic}
                            alt={board.leader.userName}
                            className="member-avatar"
                          />
                        ) : (
                          <div className="member-avatar-placeholder">
                            {getInitials(board.leader?.userName)}
                          </div>
                        )}
                      </div>
                      <span className="admin-label">You Admin</span>
                    </div>
                  </div>
                )
              })}

              {/* Create Board Card in Pending Section */}
              <div className="create-board-card" onClick={() => navigate("/create-board")}>
                <div className="create-board-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="create-board-text">Create Board</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home