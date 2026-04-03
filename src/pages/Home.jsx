import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardStore } from "../store/board.store"
import "../styles/Home.css"

function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(null)
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
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7)   return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  const getTodayLabel = () =>
    new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  const CARD_ACCENTS = [
    "#5b8dee", "#a78bfa", "#34d399", "#fb923c",
    "#ec4899", "#38bdf8", "#f59e0b", "#818cf8",
  ]

  // Derive a simple tag from board name (first word or category hint)
  const getTag = (board) => {
    if (board.tag) return board.tag
    const name = board.name?.toLowerCase() ?? ""
    if (name.includes("design"))   return "Design"
    if (name.includes("dev") || name.includes("code")) return "Dev"
    if (name.includes("market"))   return "Marketing"
    if (name.includes("research")) return "Research"
    if (name.includes("product"))  return "Product"
    return "Project"
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="home-root">
        <div className="home-loading">
          <div className="home-loading__ring" />
          <span>Loading workspace…</span>
        </div>
      </div>
    )
  }

  /* ── Error ── */
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

        {/* ══ TOP BAR ══ */}
        <header className="home-topbar">
          <div className="home-topbar__left">
            <div className="home-topbar__eyebrow">
              <span className="home-topbar__eyebrow-dot" />
              Workspace
            </div>
            <h1 className="home-topbar__title">
              My <span>Boards</span>
            </h1>
            <div className="home-topbar__meta">
              <span className="home-topbar__count">
                {sortedBoards.length} board{sortedBoards.length !== 1 ? "s" : ""}
              </span>
              <span className="home-topbar__date">{getTodayLabel()}</span>
            </div>
          </div>

          <div className="home-topbar__right">
            <button
              className="home-create-btn"
              onClick={() => navigate("/create-board")}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              New Board
            </button>
          </div>
        </header>

        {/* ══ STATS STRIP ══ */}
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat__val home-stat__val--accent">
              {sortedBoards.length}
            </span>
            <span className="home-stat__label">Active Boards</span>
            <div className="home-stat__bar" />
          </div>
          <div className="home-stat">
            <span className="home-stat__val">
              {pendingBoards.length}
            </span>
            <span className="home-stat__label">Pending</span>
            <div className="home-stat__bar" />
          </div>
          <div className="home-stat">
            <span className="home-stat__val">
              {sortedBoards.length > 0
                ? formatTimeAgo(sortedBoards[0]?.updatedAt)
                : "—"}
            </span>
            <span className="home-stat__label">Last Activity</span>
            <div className="home-stat__bar" />
          </div>
          <div className="home-stat">
            <span className="home-stat__val">
              {new Set(sortedBoards.map(b => b.leader?.userName)).size}
            </span>
            <span className="home-stat__label">Leaders</span>
            <div className="home-stat__bar" />
          </div>
        </div>

        {/* ══ ACTIVE BOARDS ══ */}
        <div className="home-section-header">
          <h2 className="home-section-title">Recent Boards</h2>
          {sortedBoards.length > 6 && (
            <span className="home-section-see-all">See all →</span>
          )}
        </div>

        {sortedBoards.length === 0 ? (
          <div className="home-empty" onClick={() => navigate("/create-board")}>
            <div className="home-empty__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17.5 14v7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
                  style={{ "--accent": accent, animationDelay: `${i * 0.07}s` }}
                  onClick={() => navigate(`/board/${board._id}`)}
                >
                  {/* ── Coloured header band ── */}
                  <div className="bcard__header">
                    <div className="bcard__header-bg" />
                    <div className="bcard__header-orb" />
                    {/* Emoji lives at header/body boundary */}
                    <div className="bcard__emoji">{board.emoji || "📋"}</div>
                  </div>

                  {/* ── Three-dot menu ── */}
                  <button
                    className="board-menu-btn"
                    onClick={(e) => handleMenuToggle(e, board._id)}
                    aria-label="Board options"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="3"  r="1.3" fill="currentColor"/>
                      <circle cx="8" cy="8"  r="1.3" fill="currentColor"/>
                      <circle cx="8" cy="13" r="1.3" fill="currentColor"/>
                    </svg>
                  </button>

                  {menuOpen === board._id && (
                    <div
                      className="bcard__dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="bcard__dropdown-item"
                        onClick={() => { navigate(`/board/${board._id}`); setMenuOpen(null) }}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3h6M8 8h6M8 13h6M2 3h2M2 8h2M2 13h2"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Open Board
                      </button>
                    </div>
                  )}

                  {/* ── Card body ── */}
                  <div className="bcard__body">
                    <h3 className="bcard__name">{board.name}</h3>

                    <div className="bcard__tags">
                      <span className="bcard__tag">{getTag(board)}</span>
                    </div>

                    <div className="bcard__spacer" />

                    {/* Footer */}
                    <div className="bcard__footer">
                      <div className="bcard__leader">
                        {board.leader?.profilePic ? (
                          <img
                            src={board.leader.profilePic}
                            alt={board.leader.userName}
                            className="bcard__avatar"
                          />
                        ) : (
                          <div className="bcard__avatar bcard__avatar--placeholder">
                            {getInitials(board.leader?.userName)}
                          </div>
                        )}
                        <span className="bcard__leader-name">
                          {board.leader?.userName}
                        </span>
                      </div>
                      <div className="bcard__right">
                        <span className="bcard__time">{formatTimeAgo(board.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ══ PENDING BOARDS ══ */}
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
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="bcard__header" style={{ "--accent": "#f59e0b" }}>
                    <div className="bcard__header-bg" />
                    <div className="bcard__header-orb" />
                    <div className="bcard__emoji">{board.emoji || "📋"}</div>
                  </div>

                  <span className="bcard__pending-badge">Pending</span>

                  <div className="bcard__body">
                    <h3 className="bcard__name">{board.name}</h3>
                    <div className="bcard__spacer" />
                    <div className="bcard__footer">
                      <div className="bcard__leader">
                        {board.leader?.profilePic ? (
                          <img
                            src={board.leader.profilePic}
                            alt={board.leader.userName}
                            className="bcard__avatar"
                          />
                        ) : (
                          <div className="bcard__avatar bcard__avatar--placeholder">
                            {getInitials(board.leader?.userName)}
                          </div>
                        )}
                        <span className="bcard__leader-name">
                          {board.leader?.userName}
                        </span>
                      </div>
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