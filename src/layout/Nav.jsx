import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { hydrateAuth } from "../auth/auth.hydrate"
import { useAuthStore } from "../auth/auth.store"
import ProtectedRoute from "../auth/ProtectedRoute"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Signup from "../pages/Signup"
import Login from "../pages/Login"

const Home = () => {
  return <h2>Home Page</h2>
}

const Nav = () => {
  const isAuthReady = useAuthStore((state) => state.isAuthReady)

  useEffect(() => {
    hydrateAuth()
  }, [])

  if (!isAuthReady) {
    return <div>Loading authentication...</div>
  }

  return (
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
    </Routes>
  )
}

export default Nav
