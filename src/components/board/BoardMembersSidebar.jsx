import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import { useAuthStore } from "../../store/auth.store"
import ConfirmationModal from "../modals/Confirmationmodal"
import Toast from "../modals/Toast"
import "../../styles/BoardMembersSidebar.css"

function BoardMembersSidebar({ isOpen, onClose, boardId, isAdmin }) {
  const [toast, setToast] = useState(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showMakeAdminConfirm, setShowMakeAdminConfirm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState("members") // "members" or "pending"
  const [imageErrors, setImageErrors] = useState({}) // Track failed image loads

  const { members, pendingMembers, approveMember, rejectMember, removeMember, makeBoardAdmin } = useBoardPageStore()
  const currentUser = useAuthStore((state) => state.user)

  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }))
  }

  const getAvatarDisplay = (member) => {
    const hasProfilePic = member.profilePic && !imageErrors[member.userId]
    
    if (hasProfilePic) {
      return (
        <img 
          src={member.profilePic} 
          alt={member.userName}
          onError={() => handleImageError(member.userId)}
          className="member-avatar-image"
        />
      )
    }
    
    // Default avatar with first letter
    return (
      <div className="member-avatar-fallback">
        {member.userName?.charAt(0).toUpperCase() || "U"}
      </div>
    )
  }

  const handleApproveMember = async (userId) => {
    try {
      await approveMember(boardId, userId)
      setToast({
        message: "Member approved successfully",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to approve member",
        type: "error"
      })
    }
  }

  const handleRejectMember = async (userId) => {
    try {
      await rejectMember(boardId, userId)
      setToast({
        message: "Member request rejected",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to reject member",
        type: "error"
      })
    }
  }

  const handleRemoveMember = async () => {
    if (!selectedMember) return

    try {
      await removeMember(boardId, selectedMember.userId)
      setToast({
        message: `${selectedMember.userName} removed from board`,
        type: "success"
      })
      setShowRemoveConfirm(false)
      setSelectedMember(null)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to remove member",
        type: "error"
      })
    }
  }

  const handleMakeAdmin = async () => {
    if (!selectedMember) return

    try {
      await makeBoardAdmin(boardId, selectedMember.userId)
      setToast({
        message: `${selectedMember.userName} is now the board admin`,
        type: "success"
      })
      setShowMakeAdminConfirm(false)
      setSelectedMember(null)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to make admin",
        type: "error"
      })
    }
  }

  const openRemoveConfirm = (member) => {
    setSelectedMember(member)
    setShowRemoveConfirm(true)
  }

  const openMakeAdminConfirm = (member) => {
    setSelectedMember(member)
    setShowMakeAdminConfirm(true)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}></div>
      
      <div className={`board-members-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h2>Board Members</h2>
              <p>{members.length} {members.length === 1 ? 'member' : 'members'}</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Tabs (only show if admin and there are pending members) */}
        {isAdmin && pendingMembers.length > 0 && (
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${activeTab === "members" ? "active" : ""}`}
              onClick={() => setActiveTab("members")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>Members</span>
              <span className="tab-count">{members.length}</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 5.25V9L11.25 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Pending</span>
              <span className="tab-count pending">{pendingMembers.length}</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="sidebar-content">
          {activeTab === "members" ? (
            // Members List
            <div className="members-list">
              {members.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                    <circle cx="32" cy="24" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 48C16 40 23 36 32 36C41 36 48 40 48 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>No members yet</p>
                </div>
              ) : (
                members.map((member) => {
                  const isCurrentUser = member.userId === currentUser?._id
                  const isMemberAdmin = member.isAdmin

                  return (
                    <div key={member.userId} className="member-card">
                      <div className="member-avatar">
                        {getAvatarDisplay(member)}
                      </div>
                      <div className="member-info">
                        <div className="member-name">
                          {member.userName}
                          {isCurrentUser && <span className="you-badge">You</span>}
                        </div>
                        <div className="member-email">{member.email}</div>
                      </div>
                      
                      {isMemberAdmin && (
                        <div className="admin-badge">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.75L8.575 5.425L12.25 6.125L9.625 8.575L10.15 12.25L7 10.325L3.85 12.25L4.375 8.575L1.75 6.125L5.425 5.425L7 1.75Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Admin
                        </div>
                      )}
                      
                      {isAdmin && !isCurrentUser && !isMemberAdmin && (
                        <div className="member-actions">
                          <button 
                            className="action-btn make-admin-btn"
                            onClick={() => openMakeAdminConfirm(member)}
                            title="Make Admin"
                          >
                            Make Admin
                          </button>
                          <button 
                            className="action-btn remove-btn"
                            onClick={() => openRemoveConfirm(member)}
                            title="Remove from Board"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            // Pending Members List
            <div className="pending-list">
              {pendingMembers.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                    <path d="M32 20V32M32 38V38.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <p>No pending requests</p>
                </div>
              ) : (
                pendingMembers.map((member) => (
                  <div key={member.userId} className="pending-card">
                    <div className="member-avatar pending">
                      {getAvatarDisplay(member)}
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member.userName}</div>
                      <div className="member-email">{member.email}</div>
                      <div className="member-requested">
                        Requested {new Date(member.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="pending-actions">
                      <button 
                        className="action-btn approve"
                        onClick={() => handleApproveMember(member.userId)}
                        title="Approve"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleRejectMember(member.userId)}
                        title="Reject"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false)
          setSelectedMember(null)
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.userName} from this board?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showMakeAdminConfirm}
        onClose={() => {
          setShowMakeAdminConfirm(false)
          setSelectedMember(null)
        }}
        onConfirm={handleMakeAdmin}
        title="Transfer Admin Rights"
        message={`Are you sure you want to make ${selectedMember?.userName} the board admin? You will lose admin privileges.`}
        confirmText="Make Admin"
        cancelText="Cancel"
        type="warning"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default BoardMembersSidebar