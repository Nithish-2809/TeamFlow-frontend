import axios from "axios"

const boardApi = axios.create({
  baseURL: "http://localhost:2231/api/boards",
  withCredentials: true
})

const createBoard = async (boardDetails, token) => {
  const res = await boardApi.post("/create", boardDetails, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const getMyBoards = async (token) => {
  const res = await boardApi.get("/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const getPendingBoards = async (token) => {
  const res = await boardApi.get("/pending-boards", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const renameBoard = async (token, boardId, newCredentials) => {
  const res = await boardApi.patch(`/${boardId}`, newCredentials, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const getBoardById = async (token, boardId) => {
  const res = await boardApi.get(`/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const deleteBoard = async (token, boardId) => {
  const res = await boardApi.delete(`/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export default {
  createBoard,
  getMyBoards,
  getPendingBoards,
  renameBoard,
  getBoardById,
  deleteBoard
}
