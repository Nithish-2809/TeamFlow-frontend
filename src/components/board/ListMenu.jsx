import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import ConfirmationModal from "../modals/ConfirmationModal"
import Toast from "../modals/Toast"
import "../../styles/ListMenu.css"

function ListMenu({ list, boardId }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newName, setNewName] = useState(list.name)
  const [toast, setToast] = useState(null)
  
  const { renameList, deleteList } = useBoardPageStore()

  const handleRename = async () => {
    if (!newName.trim()) {
      setToast({
        message: "List name cannot be empty",
        type: "error"
      })
      return
    }

    try {
      await renameList(boardId, list._id, newName.trim())
      setShowRenameModal(false)
      setShowMenu(false)
      setToast({
        message: "List renamed successfully",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to rename list",
        type: "error"
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteList(boardId, list._id)
      setShowDeleteConfirm(false)
      setShowMenu(false)
      setToast({
        message: "List deleted successfully",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to delete list",
        type: "error"
      })
    }
  }

  return (
    <>
      <div className="list-menu-wrapper">
        <button
          className="list-menu-btn"
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="menu-overlay" onClick={() => setShowMenu(false)} />
            <div className="list-dropdown-menu">
              <button
                className="menu-item"
                onClick={() => {
                  setShowRenameModal(true)
                  setShowMenu(false)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2.00004C11.5083 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6666 1.44775C12.9146 1.44775 13.1598 1.49653 13.3886 1.59129C13.6173 1.68605 13.825 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38282 14.4087 2.61158C14.5035 2.84034 14.5523 3.08556 14.5523 3.33337C14.5523 3.58119 14.5035 3.82641 14.4087 4.05517C14.314 4.28393 14.1751 4.49162 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Rename List
              </button>
              <button
                className="menu-item menu-item-danger"
                onClick={() => {
                  setShowDeleteConfirm(true)
                  setShowMenu(false)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31305 1.33337 6.66668 1.33337H9.33334C9.68697 1.33337 10.0261 1.47385 10.2762 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2762 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete List
              </button>
            </div>
          </>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="modal-overlay" onClick={() => setShowRenameModal(false)}>
          <div className="rename-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Rename List</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') setShowRenameModal(false)
              }}
              autoFocus
              className="rename-input"
            />
            <div className="modal-actions">
              <button className="btn-save" onClick={handleRename}>
                Save
              </button>
              <button className="btn-cancel" onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? All tasks in this list will be permanently deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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

export default ListMenu