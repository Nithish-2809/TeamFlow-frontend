import axios from "axios"

const boardPageApi = axios.create({
  baseURL: "http://localhost:2231/api/boards",
  withCredentials: true
})

// =======================
// BOARD DETAILS
// =======================

const getBoardDetails = async (token, boardId) => {
  const res = await boardPageApi.get(`/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const renameBoard = async (token, boardId, name) => {
  const res = await boardPageApi.patch(
    `/${boardId}/rename`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

// =======================
// MEMBERS
// =======================

const getBoardMembers = async (token, boardId) => {
  const res = await boardPageApi.get(`/${boardId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const getPendingMembers = async (token, boardId) => {
  const res = await boardPageApi.get(`/${boardId}/members/pending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

const approveMember = async (token, boardId, userId) => {
  const res = await boardPageApi.patch(
    `/${boardId}/members/${userId}/approve`,
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

const rejectMember = async (token, boardId, userId) => {
  const res = await boardPageApi.delete(
    `/${boardId}/members/${userId}/reject`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

const removeMember = async (token, boardId, userId) => {
  const res = await boardPageApi.delete(
    `/${boardId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

const leaveBoard = async (token, boardId) => {
  const res = await boardPageApi.delete(
    `/${boardId}/leave`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

const makeBoardAdmin = async (token, boardId, userId) => {
  const res = await boardPageApi.patch(
    `/${boardId}/members/${userId}/make-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

// =======================
// INVITE
// =======================

const inviteToBoard = async (token, boardId) => {
  const res = await boardPageApi.post(
    `/${boardId}/invite`,
    {}, // usually empty body
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data
}

// =======================
// LISTS
// =======================

const getBoardLists = async (token, boardId) => {
  const res = await boardPageApi.get(`/${boardId}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

// =======================
// TASKS
// =======================

const getListTasks = async (token, boardId,listId) => {
  const res = await boardPageApi.get(`/${boardId}/lists/${listId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export default {
  getBoardDetails,
  renameBoard,
  getBoardMembers,
  getPendingMembers,
  approveMember,
  rejectMember,
  removeMember,
  leaveBoard,
  makeBoardAdmin,
  inviteToBoard,
  getBoardLists,
  getListTasks
}