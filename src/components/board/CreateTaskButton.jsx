import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import Toast from "../Toast"
import "../../styles/CreateTaskButton.css"

function CreateTaskButton({ boardId, listId, isCreating, setIsCreating }) {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [toast, setToast] = useState(null)
  
  const { createTask } = useBoardPageStore()

  const handleCreate = async () => {
    if (!taskTitle.trim()) {
      setToast({
        message: "Task title cannot be empty",
        type: "error"
      })
      return
    }

    try {
      await createTask(boardId, listId, {
        title: taskTitle.trim(),
        description: taskDescription.trim()
      })
      
      setTaskTitle("")
      setTaskDescription("")
      setIsCreating(false)
      setToast({
        message: "Task created successfully",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to create task",
        type: "error"
      })
    }
  }

  const handleCancel = () => {
    setTaskTitle("")
    setTaskDescription("")
    setIsCreating(false)
  }

  if (!isCreating) {
    return (
      <>
        <button className="create-task-btn" onClick={() => setIsCreating(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add Task</span>
        </button>
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

  return (
    <>
      <div className="create-task-form">
        <input
          type="text"
          placeholder="Task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleCreate()
            }
            if (e.key === 'Escape') handleCancel()
          }}
          autoFocus
          className="task-title-input"
        />
        <textarea
          placeholder="Description (optional)..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="task-description-input"
          rows="3"
        />
        <div className="task-form-actions">
          <button className="btn-create-task" onClick={handleCreate}>
            Add Task
          </button>
          <button className="btn-cancel-task" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
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

export default CreateTaskButton