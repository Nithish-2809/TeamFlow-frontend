import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useBoardPageStore } from "./boardPage.store"
import BoardTopBar from "../components/boards/BoardTopBar"

function BoardPage() {
  const { boardId } = useParams()

  const {
    boardDetails,
    fetchBoardData
  } = useBoardPageStore()

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId)
    }
  }, [boardId])

  return (
    <div className="board-page">

      <BoardTopBar
        boardId={boardId}
        boardName={boardDetails?.name}
        boardEmoji={boardDetails?.emoji}
        boardLeader={boardDetails?.leader}
        isAdmin={boardDetails?.isAdmin}
      />

    </div>
  )
}

export default BoardPage
