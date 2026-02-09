import { useState } from "react" 
import { useNavigate } from "react-router-dom" 
import { useBoardPageStore } from "../../boardPage/boardPage.store" 
import ConfirmationModal from "../ConfirmationModal" 
import InviteModal from "../InviteModal" 
import RenameBoardModal from "../RenameBoardModal" 
import Toast from "../Toast" 
import "../../styles/BoardTopBar.css"

function BoardTopBar({ 
  boardId,
  boardName = "Board Name",
  boardEmoji = "📋",
  boardLeader,
  isAdmin = false,
  onToggleMembers, 
  onToggleChat,
  onAddList
}) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState(null)
  
  // Store actions
  const { sendInvite, leaveBoard } = useBoardPageStore()

  const handleMenuToggle = () => {
    setShowMenu(!showMenu)
  }

  const handleInvite = async () => {
    if (!boardId) {
      setToast({
        message: "Board ID is missing. Please refresh the page.",
        type: "error"
      })
      return
    }
    
    try {
      const response = await sendInvite(boardId)
      setShowInviteModal(true)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to generate invite link",
        type: "error"
      })
    }
  }

  const handleRename = () => {
    setShowMenu(false)
    setShowRenameModal(true)
  }

  const handleDelete = async () => {
    if (!boardId) {
      setToast({
        message: "Board ID is missing. Please refresh the page.",
        type: "error"
      })
      return
    }
    
    try {
      await fetch(`http://localhost:2231/api/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      setToast({
        message: "Board deleted successfully",
        type: "success"
      })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to delete board",
        type: "error"
      })
    }
  }

  const handleLeave = async () => {
    if (!boardId) {
      setToast({
        message: "Board ID is missing. Please refresh the page.",
        type: "error"
      })
      return
    }
    
    try {
      await leaveBoard(boardId)
      
      setToast({
        message: "You have left the board",
        type: "success"
      })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to leave board",
        type: "error"
      })
    }
  }

  const handleBoardSettings = () => {
    setShowMenu(false)
    // Navigate to board settings page or open settings modal
    // For now, we'll show a toast
    setToast({
      message: "Board settings coming soon!",
      type: "info"
    })
  }

  return (
    <>
      <div className="board-topbar">
        {/* LEFT SECTION - Board Name & Logo */}
        <div className="board-topbar-left">
          <div className="board-logo">
            <span className="board-emoji">{boardEmoji}</span>
          </div>
          <div className="board-info">
            <h2 className="board-title">{boardName}</h2>
            {boardLeader && (
              <span className="board-leader">
                Led by {boardLeader.userName}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SECTION - Actions */}
        <div className="board-topbar-right">
          <button 
            className="topbar-btn topbar-btn-primary"
            onClick={onAddList}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Add List</span>
          </button>

          <button 
            className="topbar-btn"
            onClick={handleInvite}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11 14V12.6667C11 11.9594 10.719 11.2811 10.219 10.781C9.71897 10.281 9.04058 10 8.33333 10H4.66667C3.95942 10 3.28103 10.281 2.78103 10.781C2.28103 11.2811 2 11.9594 2 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 5V9M9 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Invite</span>
          </button>

          <button
            className="topbar-btn"
            onClick={onToggleMembers}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 14V12.6667C2 11.9594 2.28103 11.2811 2.78103 10.781C3.28103 10.281 3.95942 10 4.66667 10H8.33333C9.04058 10 9.71897 10.281 10.219 10.781C10.719 11.2811 11 11.9594 11 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 14V13C14 12.2 13.6 11.5 13 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Members</span>
          </button>

          <button
            className="topbar-btn"
            onClick={onToggleChat}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Chat</span>
          </button>

          <div className="topbar-menu-wrapper">
            <button 
              className="topbar-icon-btn"
              onClick={handleMenuToggle}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </button>

            {showMenu && (
              <div className="topbar-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={handleBoardSettings}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13 8C13 8.34 12.98 8.68 12.94 9L14.46 10.18C14.59 10.29 14.62 10.49 14.54 10.64L13.1 13.36C13.02 13.51 12.82 13.57 12.66 13.51L10.89 12.8C10.5 13.1 10.09 13.36 9.65 13.57L9.39 15.45C9.37 15.61 9.22 15.73 9.06 15.73H6.18C6.02 15.73 5.87 15.61 5.85 15.45L5.59 13.57C5.15 13.36 4.74 13.1 4.35 12.8L2.58 13.51C2.42 13.57 2.22 13.51 2.14 13.36L0.7 10.64C0.62 10.49 0.65 10.29 0.78 10.18L2.3 9C2.26 8.68 2.24 8.34 2.24 8C2.24 7.66 2.26 7.32 2.3 7L0.78 5.82C0.65 5.71 0.62 5.51 0.7 5.36L2.14 2.64C2.22 2.49 2.42 2.43 2.58 2.49L4.35 3.2C4.74 2.9 5.15 2.64 5.59 2.43L5.85 0.55C5.87 0.39 6.02 0.27 6.18 0.27H9.06C9.22 0.27 9.37 0.39 9.39 0.55L9.65 2.43C10.09 2.64 10.5 2.9 10.89 3.2L12.66 2.49C12.82 2.43 13.02 2.49 13.1 2.64L14.54 5.36C14.62 5.51 14.59 5.71 14.46 5.82L12.94 7C12.98 7.32 13 7.66 13 8Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>Board Settings</span>
                </button>

                {isAdmin ? (
                  <>
                    <button 
                      className="dropdown-item"
                      onClick={handleRename}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.3333 2.00004C11.5083 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6666 1.44775C12.9146 1.44775 13.1598 1.49653 13.3886 1.59129C13.6173 1.68605 13.825 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38282 14.4087 2.61158C14.5035 2.84034 14.5523 3.08556 14.5523 3.33337C14.5523 3.58119 14.5035 3.82641 14.4087 4.05517C14.314 4.28393 14.1751 4.49162 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Rename Board</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button 
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setShowMenu(false)
                        setShowDeleteConfirm(true)
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31305 1.33337 6.66668 1.33337H9.33334C9.68697 1.33337 10.0261 1.47385 10.2762 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2762 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Delete Board</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setShowMenu(false)
                        setShowLeaveConfirm(true)
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6667 11.3333L14 7.99996L10.6667 4.66663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Leave Board</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          boardId={boardId}
          boardName={boardName}
        />
      )}

      {showRenameModal && (
        <RenameBoardModal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          boardId={boardId}
          currentName={boardName}
          onSuccess={(newName) => {
            setToast({
              message: `Board renamed to "${newName}"`,
              type: "success"
            })
          }}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Board"
        message={`Are you sure you want to delete "${boardName}"? This action cannot be undone and will remove all lists, tasks, and messages.`}
        confirmText="Delete Board"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={handleLeave}
        title="Leave Board"
        message={`Are you sure you want to leave "${boardName}"? You'll need to be re-invited to access it again.`}
        confirmText="Leave Board"
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

export default BoardTopBar