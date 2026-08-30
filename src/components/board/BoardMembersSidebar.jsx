import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import { useAuthStore } from "../../store/auth.store"
import ConfirmationModal from "../modals/ConfirmationModal"
import Toast from "../modals/Toast"
import "../../styles/BoardMembersSidebar.css"

function BoardMembersSidebar({ isOpen, onClose, boardId, isAdmin }) {
  const [toast, setToast] = useState(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showMakeAdminConfirm, setShowMakeAdminConfirm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState("members")
  const [imageErrors, setImageErrors] = useState({})

  const { members, pendingMembers, approveMember, rejectMember, removeMember, makeBoardAdmin } = useBoardPageStore()
  const currentUser = useAuthStore((state) => state.user)

  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }))
  }

  const getAvatar = (member) => {
    const hasProfilePic = member.profilePic && !imageErrors[member.userId]
    if (hasProfilePic) {
      return (
        <img
          src={member.profilePic}
          alt={member.userName}
          onError={() => handleImageError(member.userId)}
          className="bms-avatar-img"
        />
      )
    }
    return (
      <span className="bms-avatar-letter">
        {member.userName?.charAt(0).toUpperCase() || "U"}
      </span>
    )
  }

  const handleApproveMember = async (userId) => {
    try {
      await approveMember(boardId, userId)
      setToast({ message: "Member approved", type: "success" })
    } catch (error) {
      setToast({ message: error.response?.data?.msg || "Failed to approve", type: "error" })
    }
  }

  const handleRejectMember = async (userId) => {
    try {
      await rejectMember(boardId, userId)
      setToast({ message: "Request declined", type: "success" })
    } catch (error) {
      setToast({ message: error.response?.data?.msg || "Failed to decline", type: "error" })
    }
  }

  const handleRemoveMember = async () => {
    if (!selectedMember) return
    try {
      await removeMember(boardId, selectedMember.userId)
      setToast({ message: `${selectedMember.userName} removed`, type: "success" })
      setShowRemoveConfirm(false)
      setSelectedMember(null)
    } catch (error) {
      setToast({ message: error.response?.data?.msg || "Failed to remove", type: "error" })
    }
  }

  const handleMakeAdmin = async () => {
    if (!selectedMember) return
    try {
      await makeBoardAdmin(boardId, selectedMember.userId)
      setToast({ message: `${selectedMember.userName} is now admin`, type: "success" })
      setShowMakeAdminConfirm(false)
      setSelectedMember(null)
    } catch (error) {
      setToast({ message: error.response?.data?.msg || "Failed to promote", type: "error" })
    }
  }

  if (!isOpen) return null

  const showTabs = isAdmin && pendingMembers.length > 0

  return (
    <>
      <div className="bms-overlay" onClick={onClose} />

      <aside className="bms-panel">

        {/* Header */}
        <div className="bms-header">
          <div className="bms-header-meta">
            <h2 className="bms-title">Members</h2>
            <span className="bms-total">{members.length} total</span>
          </div>
          <button className="bms-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div className="bms-tabs">
            <button
              className={`bms-tab ${activeTab === "members" ? "active" : ""}`}
              onClick={() => setActiveTab("members")}
            >
              All members
            </button>
            <button
              className={`bms-tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Requests
              <span className="bms-req-count">{pendingMembers.length}</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="bms-body">
          {activeTab === "members" ? (
            members.length === 0 ? (
              <div className="bms-empty">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="4.5" stroke="#d1d5db" strokeWidth="1.5"/>
                  <path d="M5 24c0-4.5 4-8 9-8s9 3.5 9 8" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p>No members yet</p>
              </div>
            ) : (
              <ul className="bms-list">
                {members.map((member) => {
                  const isMe = member.userId === currentUser?._id
                  const isMemberAdmin = member.isAdmin
                  return (
                    <li key={member.userId} className="bms-row">
                      <div className="bms-avatar">
                        {getAvatar(member)}
                      </div>
                      <div className="bms-info">
                        <div className="bms-name">
                          {member.userName}
                          {isMe && <span className="bms-tag bms-tag-you">you</span>}
                          {isMemberAdmin && <span className="bms-tag bms-tag-admin">admin</span>}
                        </div>
                        <div className="bms-email">{member.email}</div>
                      </div>
                      {isAdmin && !isMe && !isMemberAdmin && (
                        <div className="bms-row-actions">
                          <button
                            className="bms-ghost-btn"
                            onClick={() => { setSelectedMember(member); setShowMakeAdminConfirm(true) }}
                          >
                            Promote
                          </button>
                          <button
                            className="bms-ghost-btn bms-ghost-btn--danger"
                            onClick={() => { setSelectedMember(member); setShowRemoveConfirm(true) }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )
          ) : (
            pendingMembers.length === 0 ? (
              <div className="bms-empty">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10.5" stroke="#d1d5db" strokeWidth="1.5"/>
                  <path d="M14 9v5l3 3" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p>No pending requests</p>
              </div>
            ) : (
              <ul className="bms-list">
                {pendingMembers.map((member) => (
                  <li key={member.userId} className="bms-row">
                    <div className="bms-avatar bms-avatar--pending">
                      {getAvatar(member)}
                    </div>
                    <div className="bms-info">
                      <div className="bms-name">{member.userName}</div>
                      <div className="bms-email">{member.email}</div>
                      <div className="bms-req-date">
                        Requested {new Date(member.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <div className="bms-row-actions">
                      <button
                        className="bms-ghost-btn bms-ghost-btn--approve"
                        onClick={() => handleApproveMember(member.userId)}
                      >
                        Approve
                      </button>
                      <button
                        className="bms-ghost-btn bms-ghost-btn--danger"
                        onClick={() => handleRejectMember(member.userId)}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </aside>

      <ConfirmationModal
        isOpen={showRemoveConfirm}
        onClose={() => { setShowRemoveConfirm(false); setSelectedMember(null) }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Remove ${selectedMember?.userName} from this board?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showMakeAdminConfirm}
        onClose={() => { setShowMakeAdminConfirm(false); setSelectedMember(null) }}
        onConfirm={handleMakeAdmin}
        title="Transfer Admin"
        message={`Make ${selectedMember?.userName} admin? You'll lose your admin access.`}
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}

export default BoardMembersSidebar