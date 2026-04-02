import { io } from "socket.io-client"

let socket = null

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:2231", {
      withCredentials: true,
      autoConnect: false,
    })
  }
  return socket
}

export const connectSocket = (userId) => {
  const s = getSocket()

  if (!s.connected) {
    s.connect()

    // ── wait for the connection to be established before registering ──
    s.once("connect", () => {
      s.emit("registerUser", userId)
    })
  } else {
    // already connected — register immediately
    s.emit("registerUser", userId)
  }

  return s
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}