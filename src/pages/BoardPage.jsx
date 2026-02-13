import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useBoardPageStore } from "../boardPage/boardPage.store"
import BoardTopBar from "../components/boards/BoardTopBar"
import BoardMembersSidebar from "../components/boards/BoardMembersSidebar"
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

  const handleAddList = () => {
    // Implement add list functionality
    console.log('Add list clicked')
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
        onAddList={handleAddList}
      />

      {/* Main Content Area */}
      <div className="board-main-content">
        <div className="board-content-inner">
          {/* Your board lists and tasks will go here */}
          <div className="board-placeholder">
            <h3>Board Content Area</h3>
            <p>Add your lists and tasks here</p>
          </div>
        </div>
      </div>

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