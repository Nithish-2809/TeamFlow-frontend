import axios from "axios";

const inviteApi = axios.create({
  baseURL: "http://localhost:2231/api/invite",
  withCredentials: true
})

const joinViaInviteLink = async (token, authToken) => {
  const res = await inviteApi.post(`/join/${token}`, {}, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
  return res.data
}

export { joinViaInviteLink }