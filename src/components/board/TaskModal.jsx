import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import ConfirmationModal from "../modals/ConfirmationModal"
import Toast from "../modals/Toast"
import "../../styles/TaskModal.css"

function TaskModal({ task, boardId, listId, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [status, setStatus] = useState(task.status)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState(null)

  const { updateTask, deleteTask } = useBoardPageStore()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 250)
  }

  const handleUpdate = async () => {
    if (!title.trim()) {
      setToast({
        message: "Task title cannot be empty",
        type: "error"
      })
      return
    }

    try {
      await updateTask(boardId, listId, task._id, {
        title: title.trim(),
        description: description.trim(),
        status
      })
      setIsEditing(false)
      setToast({
        message: "Task updated successfully",
        type: "success"
      })
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to update task",
        type: "error"
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(boardId, listId, task._id)
      setToast({
        message: "Task deleted successfully",
        type: "success"
      })
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to delete task",
        type: "error"
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#00875A'
      case 'IN_PROGRESS':
        return '#0052CC'
      default:
        return '#6B778C'
    }
  }

  return (
    <>
      <div
        className={`task-modal-overlay ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
      >
        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
          <div className="task-modal-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isEditing ? (
              <h2>{task.title}</h2>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-modal-title-input"
                autoFocus
              />
            )}
            <button className="close-modal-btn" onClick={handleClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="task-modal-content">
            <div className="task-modal-section">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  if (!isEditing) setIsEditing(true)
                }}
                className="status-select"
                style={{ borderColor: getStatusColor(status) }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="task-modal-section">
              <label>Description</label>
              {!isEditing ? (
                <p className="task-description-text" onClick={() => setIsEditing(true)}>
                  {description || "No description provided. Click to add..."}
                </p>
              ) : (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="task-modal-description-input"
                  rows="6"
                />
              )}
            </div>
          </div>

          <div className="task-modal-footer">
            {isEditing ? (
              <>
                <button className="btn-save-task" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button className="btn-cancel-edit" onClick={() => {
                  setTitle(task.title)
                  setDescription(task.description || "")
                  setStatus(task.status)
                  setIsEditing(false)
                }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn-edit-task" onClick={() => setIsEditing(true)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.3333 2.00004C11.5083 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6666 1.44775C12.9146 1.44775 13.1598 1.49653 13.3886 1.59129C13.6173 1.68605 13.825 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38282 14.4087 2.61158C14.5035 2.84034 14.5523 3.08556 14.5523 3.33337C14.5523 3.58119 14.5035 3.82641 14.4087 4.05517C14.314 4.28393 14.1751 4.49162 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
                <button className="btn-delete-task" onClick={() => setShowDeleteConfirm(true)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31305 1.33337 6.66668 1.33337H9.33334C9.68697 1.33337 10.0261 1.47385 10.2762 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2762 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
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

export default TaskModal