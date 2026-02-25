import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardStore } from "../store/board.store"
import "../styles/Home.css"

function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  const { boards, pendingBoards, fetchBoards, loading, error } = useBoardStore()

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".board-menu-btn")) setMenuOpen(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const sortedBoards = [...boards].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  const handleMenuToggle = (e, boardId) => {
    e.stopPropagation()
    setMenuOpen(menuOpen === boardId ? null : boardId)
  }

  const getInitials = (name) => name?.charAt(0).toUpperCase() ?? "?"

  const formatTimeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  // Assign a subtle accent color per board based on index
  const CARD_ACCENTS = [
    "#6366f1", "#0ea5e9", "#10b981", "#f59e0b",
    "#ec4899", "#8b5cf6", "#14b8a6", "#f97316",
  ]

  if (loading) {
    return (
      <div className="home-root">
        <div className="home-loading">
          <div className="home-loading__ring" />
          <span>Loading boards…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-root">
        <div className="home-error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-root">
      <div className="home-inner">

        {/* ── Top bar ── */}
        <header className="home-topbar">
          <div className="home-topbar__left">
            <h1 className="home-topbar__title">My Workspace</h1>
            <span className="home-topbar__count">
              {sortedBoards.length} board{sortedBoards.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            className="home-create-btn"
            onClick={() => navigate("/create-board")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            New Board
          </button>
        </header>

        {/* ── Active boards ── */}
        {sortedBoards.length === 0 ? (
          <div className="home-empty" onClick={() => navigate("/create-board")}>
            <div className="home-empty__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M17.5 14v7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="home-empty__title">No boards yet</p>
            <p className="home-empty__sub">Click to create your first board</p>
          </div>
        ) : (
          <div className="home-grid">
            {sortedBoards.map((board, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length]
              return (
                <div
                  key={board._id}
                  className="bcard"
                  style={{ "--accent": accent, animationDelay: `${i * 0.06}s` }}
                  onClick={() => navigate(`/board/${board._id}`)}
                  onMouseEnter={() => setHoveredCard(board._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Accent strip */}
                  <div className="bcard__strip" />

                  {/* Three-dot menu */}
                  <button
                    className="board-menu-btn"
                    onClick={(e) => handleMenuToggle(e, board._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                      <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                    </svg>
                  </button>

                  {menuOpen === board._id && (
                    <div className="bcard__dropdown" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="bcard__dropdown-item"
                        onClick={() => { navigate(`/board/${board._id}`); setMenuOpen(null) }}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3h8M8 8h8M8 13h8M2 3h2M2 8h2M2 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Open Board
                      </button>
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="bcard__emoji">{board.emoji || "📋"}</div>

                  {/* Name */}
                  <h3 className="bcard__name">{board.name}</h3>

                  {/* Footer */}
                  <div className="bcard__footer">
                    <div className="bcard__leader">
                      {board.leader?.profilePic ? (
                        <img src={board.leader.profilePic} alt={board.leader.userName} className="bcard__avatar" />
                      ) : (
                        <div className="bcard__avatar bcard__avatar--placeholder">
                          {getInitials(board.leader?.userName)}
                        </div>
                      )}
                      <span className="bcard__leader-name">{board.leader?.userName}</span>
                    </div>
                    <span className="bcard__time">{formatTimeAgo(board.updatedAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Pending boards ── */}
        {pendingBoards.length > 0 && (
          <section className="home-pending">
            <div className="home-pending__header">
              <span className="home-pending__label">Awaiting approval</span>
              <span className="home-pending__pill">{pendingBoards.length}</span>
            </div>
            <div className="home-grid home-grid--pending">
              {pendingBoards.map((board, i) => (
                <div
                  key={board._id}
                  className="bcard bcard--pending"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="bcard__pending-badge">Pending</div>
                  <div className="bcard__emoji">{board.emoji || "📋"}</div>
                  <h3 className="bcard__name">{board.name}</h3>
                  <div className="bcard__footer">
                    <div className="bcard__leader">
                      {board.leader?.profilePic ? (
                        <img src={board.leader.profilePic} alt={board.leader.userName} className="bcard__avatar" />
                      ) : (
                        <div className="bcard__avatar bcard__avatar--placeholder">
                          {getInitials(board.leader?.userName)}
                        </div>
                      )}
                      <span className="bcard__leader-name">{board.leader?.userName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default Home