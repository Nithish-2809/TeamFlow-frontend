
import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import Toast from "../modals/Toast"
import "../../styles/PendingRequestsPanel.css"

function PendingRequestsPanel({ boardId, onClose }) {
  const { pendingMembers, approveMember, rejectMember } = useBoardPageStore()
  const [loadingId, setLoadingId] = useState(null) // userId currently being processed
  const [toast, setToast] = useState(null)

  const handleApprove = async (userId) => {
    setLoadingId(userId)
    try {
      await approveMember(boardId, userId)
      setToast({ message: "Member approved!", type: "success" })
    } catch (err) {
      setToast({
        message: err.response?.data?.msg || "Failed to approve member",
        type: "error",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (userId) => {
    setLoadingId(userId)
    try {
      await rejectMember(boardId, userId)
      setToast({ message: "Request rejected.", type: "info" })
    } catch (err) {
      setToast({
        message: err.response?.data?.msg || "Failed to reject request",
        type: "error",
      })
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <>
      <div className="pending-panel">
        {/* Header */}
        <div className="pending-panel__header">
          <div className="pending-panel__title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Join Requests</span>
            {pendingMembers.length > 0 && (
              <span className="pending-panel__badge">{pendingMembers.length}</span>
            )}
          </div>
          <button className="pending-panel__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="pending-panel__body">
          {pendingMembers.length === 0 ? (
            <div className="pending-panel__empty">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity=".3" />
                <path d="M11 16h10M16 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".3" />
              </svg>
              <p>No pending requests</p>
            </div>
          ) : (
            <ul className="pending-panel__list">
              {pendingMembers.map((member) => {
                const isProcessing = loadingId === member.userId
                return (
                  <li key={member.userId} className="pending-panel__item">
                    {/* Avatar */}
                    <div className="pending-panel__avatar">
                      {member.profilePic ? (
                        <img src={member.profilePic} alt={member.userName} />
                      ) : (
                        <span>{member.userName?.[0]?.toUpperCase() ?? "?"}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="pending-panel__info">
                      <p className="pending-panel__name">{member.userName}</p>
                      <p className="pending-panel__email">{member.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="pending-panel__actions">
                      <button
                        className="pending-btn pending-btn--approve"
                        onClick={() => handleApprove(member.userId)}
                        disabled={isProcessing}
                        title="Approve"
                      >
                        {isProcessing ? (
                          <span className="pending-btn__spinner" />
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <button
                        className="pending-btn pending-btn--reject"
                        onClick={() => handleReject(member.userId)}
                        disabled={isProcessing}
                        title="Reject"
                      >
                        {isProcessing ? (
                          <span className="pending-btn__spinner" />
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}

export default PendingRequestsPanel