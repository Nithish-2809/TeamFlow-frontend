import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { hydrateAuth } from "../auth/auth.hydrate"
import { useAuthStore } from "../auth/auth.store"
import ProtectedRoute from "../auth/ProtectedRoute"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Profile from "../auth/Profile"

const Nav = () => {
const isAuthReady = useAuthStore((state) => state.isAuthReady)
const user = useAuthStore((state) => state.user)

  useEffect(() => {
    hydrateAuth()
  }, [])

  if (!isAuthReady) {
    return <div>Loading authentication...</div>
  }

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Route */}
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

      </Routes>
    </>
  )
}

export default Nav
