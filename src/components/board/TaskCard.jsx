import { useState } from "react"
import { createPortal } from "react-dom"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskModal from "./TaskModal"
import "../../styles/TaskCard.css"

function TaskCard({ task, boardId, listId, isAdmin, isDragging = false }) {
  const [showModal, setShowModal] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'task',
      task,
      listId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    cursor: 'pointer',
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed'
      case 'IN_PROGRESS':
        return 'status-in-progress'
      default:
        return 'status-pending'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed'
      case 'IN_PROGRESS':
        return 'In Progress'
      default:
        return 'Pending'
    }
  }

  const handleCardClick = (e) => {
    // Prevent opening modal while dragging
    if (!isSortableDragging) {
      setShowModal(true)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card"
        onClick={handleCardClick}
      >
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-footer">
          <span className={`task-status ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
          {task.assignedTo ? (
            <span className="task-assignee" title={task.assignedTo.userName}>
              {task.assignedTo.profilePic ? (
                <img
                  src={task.assignedTo.profilePic}
                  alt={task.assignedTo.userName}
                  className="task-assignee-avatar"
                />
              ) : (
                <span className="task-assignee-avatar task-assignee-avatar--letter">
                  {task.assignedTo.userName?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              <span className="task-assignee-name">{task.assignedTo.userName}</span>
            </span>
          ) : (
            <span className="task-assignee task-assignee--empty">Not yet assigned</span>
          )}
        </div>
      </div>

      {showModal && createPortal(
        <TaskModal
          task={task}
          boardId={boardId}
          listId={listId}
          isAdmin={isAdmin}
          onClose={() => setShowModal(false)}
        />,
        document.body
      )}
    </>
  )
}

export default TaskCard