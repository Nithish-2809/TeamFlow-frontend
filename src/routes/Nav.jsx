import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { hydrateAuth } from "../hooks/auth.hydrate"
import { useAuthStore } from "../store/auth.store"
import ProtectedRoute from "./ProtectedRoute"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Navbar from "../components/layout/Navbar"
import Home from "../pages/Home"
import Profile from "../pages/Profile"
import CreateBoard from "../components/board/CreateBoard"
import BoardPage from "../pages/BoardPage"

const Nav = () => {
  const location = useLocation()
  const isAuthReady = useAuthStore((state) => state.isAuthReady)
  const user = useAuthStore((state) => state.user)

  // Hide navbar on board pages
  const isBoardPage = location.pathname.startsWith('/board/')

  useEffect(() => {
    hydrateAuth()
  }, [])

  if (!isAuthReady) {
    return <div>Loading authentication...</div>
  }

  return (
    <>
      {/* Only show Navbar if user is logged in AND not on a board page */}
      {user && !isBoardPage && <Navbar />} 

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-board"
          element={
            <ProtectedRoute>
              <CreateBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default Nav