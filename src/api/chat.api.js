import axios from "axios"

const chatApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
})

const getChatHistory = async (token, boardId, { limit = 40, cursor } = {}) => {
  const params = { limit }
  if (cursor) params.cursor = cursor

  const res = await chatApi.get(`/boards/${boardId}/chat`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })
  return res.data
}

const getBoardChats = async (token) => {
  const res = await chatApi.get("/board-chats", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const getDmChats = async (token) => {
  const res = await chatApi.get("/personal-chats", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export default { getChatHistory, getBoardChats, getDmChats }