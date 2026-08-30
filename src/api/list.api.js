import axios from "axios";

const listApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
})


const getBoardLists = async (token, boardId) => {
  const res = await listApi.get(`/boards/${boardId}/lists`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}


const createList = async (token, boardId, name) => {
  const res = await listApi.post(
    `/boards/${boardId}/lists`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const renameList = async (token, boardId, listId, name) => {
  const res = await listApi.patch(
    `/boards/${boardId}/lists/${listId}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const deleteList = async (token, boardId, listId) => {
  const res = await listApi.delete(
    `/boards/${boardId}/lists/${listId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}


const reorderLists = async (token, boardId, orderedListIds) => {
  const res = await listApi.patch(
    `/boards/${boardId}/lists/reorder`,
    { orderedListIds },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}

export { getBoardLists, createList, renameList, deleteList, reorderLists }