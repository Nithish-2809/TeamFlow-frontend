import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { hydrateAuth } from "../auth/auth.hydrate"
import { useAuthStore } from "../auth/auth.store"
import { ProtectedRoute } from "../auth/ProtectedRoute"


const Login = () => <div>Login</div>
const Signup = () => <div>Signup</div>
const Dashboard = () => <div>Dashboard</div>

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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Nav
