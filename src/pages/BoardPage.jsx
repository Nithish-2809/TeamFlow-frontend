import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useBoardPageStore } from "../store/boardPage.store"
import BoardTopBar from "../components/board/BoardTopBar"
import BoardMembersSidebar from "../components/board/BoardmembersSidebar"
import BoardContent from "../components/board/BoardContent"
import ChatSidebar from "../components/board/ChatSidebar"
import '../styles/BoardPage.css'

function BoardPage() {
  const { boardId } = useParams()
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