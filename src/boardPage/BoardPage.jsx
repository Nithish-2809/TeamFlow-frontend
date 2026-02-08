import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBoardPageStore } from "./boardPage.store";
import "../styles/BoardPage.css";
import BoardTopBar from "../components/boards/BoardTopBar";

function BoardPage() {
  const { boardId } = useParams();

  const {
    boardDetails,
    lists,
    tasksByList,
    loading,
    error,
    fetchBoardData,
    resetBoardState,
  } = useBoardPageStore();

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId);
    }

    return () => {
      resetBoardState(); // important when navigating away
    };
  }, [boardId]);

  if (loading) return <div className="board-loading">Loading board...</div>;
  if (error) return <div className="board-error">{error}</div>;

  return (
    <div className="board-page">
      {/* ===== TOP BAR ===== */}
      <BoardTopBar/>

      {/* ===== LISTS HORIZONTAL CONTAINER ===== */}
      <div className="lists-scroll-container">
        {lists.map((list) => (
          <div key={list._id} className="list-column">
            <div className="list-header">
              <h4>{list.name}</h4>
            </div>

            <div className="tasks-container">
              {tasksByList[list._id]?.length > 0 ? (
                tasksByList[list._id].map((task) => (
                  <div key={task._id} className="task-card">
                    {task.title}
                  </div>
                ))
              ) : (
                <p className="empty-tasks">No tasks yet</p>
              )}
            </div>

            <button className="add-task-btn">
              + Add Task
            </button>
          </div>
        ))}

        {/* ===== ADD LIST BUTTON ===== */}
        <div className="add-list-column">
          <button>+ Add List</button>
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
