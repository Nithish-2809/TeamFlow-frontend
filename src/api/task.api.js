import axios from "axios";

const taskApi = axios.create({
  baseURL: "http://localhost:2231/api",
  withCredentials: true
})


const getListTasks = async (token, boardId, listId) => {
  const res = await taskApi.get(
    `/boards/${boardId}/lists/${listId}/tasks`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const createTask = async (token, boardId, listId, taskData) => {
  const res = await taskApi.post(
    `/boards/${boardId}/lists/${listId}/tasks`,
    taskData,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const updateTask = async (token, boardId, listId, taskId, taskData) => {
  const res = await taskApi.patch(
    `/boards/${boardId}/lists/${listId}/tasks/${taskId}`,
    taskData,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const deleteTask = async (token, boardId, listId, taskId) => {
  const res = await taskApi.delete(
    `/boards/${boardId}/lists/${listId}/tasks/${taskId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const reorderTasks = async (token, boardId, listId, orderedTaskIds) => {
  const res = await taskApi.patch(
    `/boards/${boardId}/lists/${listId}/tasks/reorder`,
    { orderedTaskIds },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}

export { getListTasks, createTask, updateTask, deleteTask, reorderTasks }