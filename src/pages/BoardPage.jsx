import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useBoardPageStore } from "../store/boardPage.store"
import { useAuthStore } from "../store/auth.store"
import { connectSocket, getSocket } from "../socket/socket"
import BoardTopBar from "../components/board/BoardTopBar"
import BoardMembersSidebar from "../components/board/BoardMembersSidebar"
import BoardContent from "../components/board/BoardContent"
import ChatSidebar from "../components/board/ChatSidebar"
import '../styles/BoardPage.css'

function BoardPage() {
  const { boardId } = useParams()
  const { user } = useAuthStore()
  const [showMembersSidebar, setShowMembersSidebar] = useState(false)
  const [showChatSidebar, setShowChatSidebar] = useState(false)

  const {
    boardDetails,
    loading,
    error,
    fetchBoardData,
    resetBoardState
  } = useBoardPageStore()

  useEffect(() => {
    if (boardId) fetchBoardData(boardId)
    return () => resetBoardState()
  }, [boardId, fetchBoardData, resetBoardState])

  useEffect(() => {
    if (!boardId || !user?._id) return
    const socket = connectSocket(user._id)

    const join = () => {
      socket.emit("joinBoard", boardId)
    }

    if (socket.connected) {
      join()
    } else {
      socket.once("connect", join)
    }

    const {
      applyListCreated,
      applyListRenamed,
      applyListDeleted,
      applyListsReordered,
      applyTaskCreated,
      applyTaskUpdated,
      applyTaskDeleted,
      applyTasksReordered,
      applyTaskAssigned,
      applyTasksUnassignedBulk,
      applyMemberJoined,
      applyMemberRejected,
      applyMemberRemoved,
      applyMemberLeft,
      applyAdminChanged,
      applyJoinRequestReceived
    } = useBoardPageStore.getState()

    const onListCreated = ({ list }) => applyListCreated(list)
    const onListRenamed = ({ listId, newName }) => applyListRenamed(listId, newName)
    const onListDeleted = ({ listId }) => applyListDeleted(listId)
    const onListsReordered = ({ orderedListIds }) => applyListsReordered(orderedListIds)

    const onTaskCreated = ({ listId, task }) => applyTaskCreated(listId, task)
    const onTaskUpdated = ({ listId, task }) => applyTaskUpdated(listId, task)
    const onTaskDeleted = ({ listId, taskId }) => applyTaskDeleted(listId, taskId)
    const onTasksReordered = ({ listId, orderedTaskIds }) => applyTasksReordered(listId, orderedTaskIds)
    const onTaskAssigned = ({ listId, taskId, assignedTo }) => applyTaskAssigned(listId, taskId, assignedTo)
    const onTasksUnassignedBulk = ({ userId }) => applyTasksUnassignedBulk(userId)

    const onMemberJoined = ({ boardId: joinedBoardId }) => applyMemberJoined(joinedBoardId)
    const onMemberRejected = ({ userId }) => applyMemberRejected(userId)
    const onMemberRemoved = ({ userId }) => {
      applyMemberRemoved(userId)
      if (userId === user._id) {
        window.location.href = "/"
      }
    }
    const onMemberLeft = ({ userId }) => applyMemberLeft(userId)
    const onAdminChanged = ({ newAdminId }) => applyAdminChanged(newAdminId, user._id)
    const onJoinRequest = ({ boardId: reqBoardId }) => {
      if (reqBoardId === boardId) applyJoinRequestReceived(boardId)
    }

    socket.on("list:created", onListCreated)
    socket.on("list:renamed", onListRenamed)
    socket.on("list:deleted", onListDeleted)
    socket.on("list:reordered", onListsReordered)

    socket.on("task:created", onTaskCreated)
    socket.on("task:updated", onTaskUpdated)
    socket.on("task:deleted", onTaskDeleted)
    socket.on("task:reordered", onTasksReordered)
    socket.on("task:assigned", onTaskAssigned)
    socket.on("tasks:unassigned-bulk", onTasksUnassignedBulk)

    socket.on("member:joined", onMemberJoined)
    socket.on("member:rejected", onMemberRejected)
    socket.on("member:removed", onMemberRemoved)
    socket.on("member:left", onMemberLeft)
    socket.on("admin:changed", onAdminChanged)
    socket.on("member:join-request", onJoinRequest)

    return () => {
      socket.off("connect", join)
      socket.off("list:created", onListCreated)
      socket.off("list:renamed", onListRenamed)
      socket.off("list:deleted", onListDeleted)
      socket.off("list:reordered", onListsReordered)
      socket.off("task:created", onTaskCreated)
      socket.off("task:updated", onTaskUpdated)
      socket.off("task:deleted", onTaskDeleted)
      socket.off("task:reordered", onTasksReordered)
      socket.off("task:assigned", onTaskAssigned)
      socket.off("tasks:unassigned-bulk", onTasksUnassignedBulk)
      socket.off("member:joined", onMemberJoined)
      socket.off("member:rejected", onMemberRejected)
      socket.off("member:removed", onMemberRemoved)
      socket.off("member:left", onMemberLeft)
      socket.off("admin:changed", onAdminChanged)
      socket.off("member:join-request", onJoinRequest)
      socket.emit("leaveBoard", boardId)
    }
  }, [boardId, user?._id])

  const handleToggleMembers = () => {
    setShowMembersSidebar((prev) => !prev)
    if (showChatSidebar) setShowChatSidebar(false)
  }

  const handleToggleChat = () => {
    setShowChatSidebar((prev) => !prev)
    if (showMembersSidebar) setShowMembersSidebar(false)
  }

  if (loading) {
    return (
      <div className="board-page-loading">
        <div className="loading-spinner" />
        <p>Loading board...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="board-page-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Board</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!boardDetails) {
    return (
      <div className="board-page-error">
        <div className="error-icon">🔍</div>
        <h2>Board Not Found</h2>
        <p>The board you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    )
  }

  return (
    <div className="board-page">
      <BoardTopBar
        boardId={boardId}
        boardName={boardDetails.name}
        boardEmoji={boardDetails.emoji}
        boardLeader={boardDetails.leader}
        isAdmin={boardDetails.isAdmin}
        onToggleMembers={handleToggleMembers}
        onToggleChat={handleToggleChat}
      />

      <div className={`board-main ${showChatSidebar ? "chat-open" : ""} ${showMembersSidebar ? "members-open" : ""}`}>
        <BoardContent
          boardId={boardId}
          isAdmin={boardDetails.isAdmin}
        />
      </div>

      <BoardMembersSidebar
        isOpen={showMembersSidebar}
        onClose={() => setShowMembersSidebar(false)}
        boardId={boardId}
        isAdmin={boardDetails?.isAdmin || false}
      />

      <ChatSidebar
        boardId={boardId}
        isOpen={showChatSidebar}
        onClose={() => setShowChatSidebar(false)}
      />
    </div>
  )
}

export default BoardPage