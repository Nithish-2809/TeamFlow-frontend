import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useBoardPageStore } from "../../store/boardPage.store"
import BoardList from "./BoardList"
import TaskCard from "./TaskCard"
import CreateListButton from "./CreateListButton"
import "../../styles/BoardContent.css"

function BoardContent({ boardId, isAdmin }) {
  const { lists, tasksByList, reorderLists, reorderTasks } = useBoardPageStore()
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null) // 'list' or 'task'
  const [activeListId, setActiveListId] = useState(null) // Track which list the task belongs to

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    
    // Determine if we're dragging a list or a task
    if (active.data.current?.type === 'list') {
      setActiveType('list')
    } else if (active.data.current?.type === 'task') {
      setActiveType('task')
      setActiveListId(active.data.current?.listId)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) {
      setActiveId(null)
      setActiveType(null)
      setActiveListId(null)
      return
    }

    if (activeType === 'list') {
      const oldIndex = lists.findIndex((list) => list._id === active.id)
      const newIndex = lists.findIndex((list) => list._id === over.id)
      
      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex)
        const orderedListIds = newLists.map(list => list._id)
        
        try {
          await reorderLists(boardId, orderedListIds)
        } catch (error) {
          console.error('Failed to reorder lists:', error)
        }
      }
    } else if (activeType === 'task') {
      const overListId = over.data.current?.listId || activeListId
      
      if (overListId && activeListId) {
        const currentTasks = tasksByList[overListId] || []
        const oldIndex = currentTasks.findIndex(task => task._id === active.id)
        const newIndex = currentTasks.findIndex(task => task._id === over.id)
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newTasks = arrayMove(currentTasks, oldIndex, newIndex)
          const orderedTaskIds = newTasks.map(task => task._id)
          
          try {
            await reorderTasks(boardId, overListId, orderedTaskIds)
          } catch (error) {
            console.error('Failed to reorder tasks:', error)
          }
        }
      }
    }

    setActiveId(null)
    setActiveType(null)
    setActiveListId(null)
  }

  const activeList = activeType === 'list' 
    ? lists.find(list => list._id === activeId)
    : null

  const activeTask = activeType === 'task'
    ? Object.values(tasksByList)
        .flat()
        .find(task => task._id === activeId)
    : null

  return (
    <div className="board-content">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board-lists-container">
          <SortableContext
            items={lists.map(list => list._id)}
            strategy={horizontalListSortingStrategy}
          >
            {lists.map((list) => (
              <BoardList
                key={list._id}
                list={list}
                tasks={tasksByList[list._id] || []}
                boardId={boardId}
                isAdmin={isAdmin}
              />
            ))}
          </SortableContext>
          <CreateListButton boardId={boardId} />
        </div>

        <DragOverlay>
          {activeType === 'list' && activeList ? (
            <div className="list-drag-overlay">
              <div className="list-header">
                <h3>{activeList.name}</h3>
              </div>
            </div>
          ) : null}
          {activeType === 'task' && activeTask ? (
            <TaskCard task={activeTask} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default BoardContent