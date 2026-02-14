import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { loginAndSetAuth, googleLoginAndSetAuth } from "../services/auth.service"
import Toast from "../components/modals/Toast"
import "../styles/Login.css"

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const closeToast = () => {
    setToast(null)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await loginAndSetAuth(form)
      showToast("Login successful! Redirecting...", "success")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Login failed. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    setError("")

    if (!credentialResponse?.credential) {
      const errorMessage = "Google authentication failed. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
      return
    }

    try {
      await googleLoginAndSetAuth(credentialResponse.credential)
      showToast("Login successful! Redirecting...", "success")
      setTimeout(() => {
        navigate("/",{replace : true})
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Google login failed. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          duration={4000}
        />
      )}

      <div className="login-container">
        {/* Left branding section */}
        <div className="login-left">
          <div className="brand-content">
            <div className="brand-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="8" fill="url(#gradient)"/>
                <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#0052CC"/>
                    <stop offset="100%" stopColor="#2684FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-tagline">Log in to continue your journey with TeamFlow.</p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Access your projects instantly</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Sync across all devices</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form section */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Log in to your account</h2>
              <p>Enter your details to continue</p>
            </div>

            {error && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4V8M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className={`input-group ${focusedField === 'password' ? 'focused' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 3L17 17M10 7C11.66 7 13 8.34 13 10C13 10.36 12.93 10.7 12.81 11.02M10 13C8.34 13 7 11.66 7 10C7 9.64 7.07 9.3 7.19 8.98M17.94 13.94C18.6 12.77 19 11.43 19 10C19 5 14.52 1 10 1C9.3 1 8.62 1.08 7.97 1.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M10 1C14.52 1 19 5 19 10C19 15 14.52 19 10 19C5.48 19 1 15 1 10C1 5 5.48 1 10 1Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="forgot-password-link">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Log in"
                )}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <div className="google-signin-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google login failed. Please try again.")}
                  useOneTap
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                  theme="filled_black"
                />
              </div>

              <div className="form-footer">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login