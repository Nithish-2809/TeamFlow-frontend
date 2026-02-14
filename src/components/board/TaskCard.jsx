import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskModal from "./TaskModal"
import "../../styles/TaskCard.css"

function TaskCard({ task, boardId, listId, isDragging = false }) {
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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card"
        onClick={() => setShowModal(true)}
      >
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-footer">
          <span className={`task-status ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          boardId={boardId}
          listId={listId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default TaskCard