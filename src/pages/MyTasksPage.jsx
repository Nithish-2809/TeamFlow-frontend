import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMyTasksStore } from "../store/myTasks.store"
import "../styles/MyTasksPage.css"

function MyTasksPage() {
  const navigate = useNavigate()
  const { boards, loading, error, fetchMyTasks } = useMyTasksStore()

  useEffect(() => {
    fetchMyTasks()
  }, [fetchMyTasks])

  const totalCount = boards.reduce(
    (sum, b) => sum + b.pending.length + b.inProgress.length,
    0
  )

  if (loading) {
    return (
      <div className="mytasks-root">
        <div className="mytasks-loading">
          <div className="mytasks-loading__ring" />
          <span>Loading your tasks…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mytasks-root">
        <div className="mytasks-error">
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
    <div className="mytasks-root">
      <div className="mytasks-inner">
        <header className="mytasks-topbar">
          <div className="mytasks-topbar__eyebrow">
            <span className="mytasks-topbar__eyebrow-dot" />
            Assigned to you
          </div>
          <h1 className="mytasks-topbar__title">
            My <span>Tasks</span>
          </h1>
          <span className="mytasks-topbar__count">
            {totalCount} open task{totalCount !== 1 ? "s" : ""} across {boards.length} board{boards.length !== 1 ? "s" : ""}
          </span>
        </header>

        {boards.length === 0 ? (
          <div className="mytasks-empty">
            <div className="mytasks-empty__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mytasks-empty__title">You're all caught up</p>
            <p className="mytasks-empty__sub">No pending or in-progress tasks assigned to you right now</p>
          </div>
        ) : (
          <div className="mytasks-boards">
            {boards.map((board) => (
              <section key={board.boardId} className="mytasks-board">
                <div
                  className="mytasks-board__header"
                  onClick={() => navigate(`/board/${board.boardId}`)}
                >
                  <span className="mytasks-board__emoji">{board.boardEmoji || "📋"}</span>
                  <h2 className="mytasks-board__name">{board.boardName}</h2>
                  <span className="mytasks-board__count">
                    {board.pending.length + board.inProgress.length}
                  </span>
                  <svg className="mytasks-board__arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="mytasks-groups">
                  {board.inProgress.length > 0 && (
                    <div className="mytasks-group">
                      <div className="mytasks-group__label">
                        <span className="mytasks-dot mytasks-dot--progress" />
                        In Progress
                      </div>
                      <div className="mytasks-group__list">
                        {board.inProgress.map((task) => (
                          <div
                            key={task._id}
                            className="mytasks-task"
                            onClick={() => navigate(`/board/${board.boardId}`)}
                          >
                            <span className="mytasks-task__title">{task.title}</span>
                            <span className="mytasks-task__list">{task.listName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {board.pending.length > 0 && (
                    <div className="mytasks-group">
                      <div className="mytasks-group__label">
                        <span className="mytasks-dot mytasks-dot--pending" />
                        Pending
                      </div>
                      <div className="mytasks-group__list">
                        {board.pending.map((task) => (
                          <div
                            key={task._id}
                            className="mytasks-task"
                            onClick={() => navigate(`/board/${board.boardId}`)}
                          >
                            <span className="mytasks-task__title">{task.title}</span>
                            <span className="mytasks-task__list">{task.listName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTasksPage