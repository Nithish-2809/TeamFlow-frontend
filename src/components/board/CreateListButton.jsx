import { useState } from "react"
import { useBoardPageStore } from "../../store/boardPage.store"
import Toast from "../Toast"
import "../../styles/CreateListButton.css"

function CreateListButton({ boardId }) {
  const [isCreating, setIsCreating] = useState(false)
  const [listName, setListName] = useState("")
  const [toast, setToast] = useState(null)
  
  const { createList } = useBoardPageStore()

  const handleCreate = async () => {
    if (!listName.trim()) {
      setToast({
        message: "List name cannot be empty",
        type: "error"
      })
      return
    }

    try {
      await createList(boardId, listName.trim())
      setListName("")
      setIsCreating(false)
      setToast({
        message: "List created successfully",
        type: "success"
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to create list",
        type: "error"
      })
    }
  }

  const handleCancel = () => {
    setListName("")
    setIsCreating(false)
  }

  if (!isCreating) {
    return (
      <>
        <button className="create-list-btn" onClick={() => setIsCreating(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add List</span>
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
      <div className="create-list-form">
        <input
          type="text"
          placeholder="Enter list name..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate()
            if (e.key === 'Escape') handleCancel()
          }}
          autoFocus
          className="list-name-input"
        />
        <div className="list-form-actions">
          <button className="btn-create" onClick={handleCreate}>
            Add List
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
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

export default CreateListButton