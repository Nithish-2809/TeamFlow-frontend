import axios from "axios";

const inviteApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/boards`,
  withCredentials: true
});

// Validate invite token (public)
const validateInviteToken = async (token) => {
  const res = await inviteApi.get(`/invite/${token}`);
  return res.data;
};

// Join via invite link (requires auth)
const joinViaInviteLink = async (token, authToken) => {
  const res = await inviteApi.post(`/invite/${token}/join`, {}, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  return res.data;
};

export { validateInviteToken, joinViaInviteLink };