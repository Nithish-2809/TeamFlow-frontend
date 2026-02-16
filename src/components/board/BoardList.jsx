import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useBoardPageStore } from "../../store/boardPage.store"
import TaskCard from "./TaskCard"
import CreateTaskButton from "./CreateTaskButton"
import ListMenu from "./ListMenu"
import "../../styles/BoardList.css"

function BoardList({ list, tasks, boardId, isAdmin }) {
  const [isCreatingTask, setIsCreatingTask] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list._id,
    data: {
      type: 'list',
      list,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="board-list"
      {...attributes}
      {...listeners}
    >
      <div className="list-header">
        <h3 className="list-title">{list.name}</h3>
        <div className="list-actions">
          <span className="task-count">{tasks.length}</span>
          {isAdmin && <ListMenu list={list} boardId={boardId} />}
        </div>
      </div>

      <div className="list-tasks">
        <SortableContext
          items={tasks.map(task => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              boardId={boardId}
              listId={list._id}
            />
          ))}
        </SortableContext>
      </div>

      <CreateTaskButton
        boardId={boardId}
        listId={list._id}
        isCreating={isCreatingTask}
        setIsCreating={setIsCreatingTask}
      />
    </div>
  )
}

export default BoardList