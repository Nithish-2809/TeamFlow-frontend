import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useBoardPageStore } from "../store/boardPage.store"
import BoardTopBar from "../components/board/BoardTopBar"
import BoardMembersSidebar from "../components/board/BoardmembersSidebar"
import BoardContent from "../components/board/BoardContent"
import '../styles/BoardPage.css'

function BoardPage() {
  const { boardId } = useParams()
  const [showMembersSidebar, setShowMembersSidebar] = useState(false)
  const [showChatSidebar, setShowChatSidebar] = useState(false)

  const { 
    boardDetails, 
    members,
    loading, 
    error, 
    fetchBoardData,
    resetBoardState
  } = useBoardPageStore()

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId)
    }

    return () => {
      resetBoardState()
    }
  }, [boardId, fetchBoardData, resetBoardState])

  const handleToggleMembers = () => {
    setShowMembersSidebar(!showMembersSidebar)
    if (showChatSidebar) setShowChatSidebar(false)
  }

  const handleToggleChat = () => {
    setShowChatSidebar(!showChatSidebar)
    if (showMembersSidebar) setShowMembersSidebar(false)
  }

  if (loading) {
    return (
      <div className="board-page-loading">
        <div className="loading-spinner"></div>
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
      {/* Top Bar */}
      <BoardTopBar
        boardId={boardId}
        boardName={boardDetails.name}
        boardEmoji={boardDetails.emoji}
        boardLeader={boardDetails.leader}
        isAdmin={boardDetails.isAdmin}
        onToggleMembers={handleToggleMembers}
        onToggleChat={handleToggleChat}
      />

      {/* Main Board Content with Lists and Tasks */}
      <BoardContent 
        boardId={boardId} 
        isAdmin={boardDetails.isAdmin}
      />

      {/* Members Sidebar */}
      <BoardMembersSidebar
        isOpen={showMembersSidebar}
        onClose={() => setShowMembersSidebar(false)}
        boardId={boardId}
        isAdmin={boardDetails?.isAdmin || false}
      />

      {/* Chat Sidebar (placeholder) */}
      {showChatSidebar && (
        <div className="chat-sidebar">
          <div className="sidebar-overlay" onClick={() => setShowChatSidebar(false)}></div>
          <div className="chat-sidebar-content">
            <h3>Chat Sidebar</h3>
            <p>Chat functionality coming soon...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BoardPage