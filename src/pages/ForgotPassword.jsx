import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPassword } from "../api/auth.api"
import Toast from "../components/Toast"
import "../styles/ForgotPassword.css"

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [focusedField, setFocusedField] = useState("")
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const closeToast = () => {
    setToast(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await forgotPassword(email)
      const successMessage = res.msg || "Password reset link sent to your email!"
      setSuccess(successMessage)
      showToast(successMessage, "success")
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Something went wrong. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
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

      <div className="forgot-password-container">
        {/* Left branding section */}
        <div className="forgot-password-left">
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
            <h1 className="brand-title">Forgot Password?</h1>
            <p className="brand-tagline">Don't worry! Enter your email and we'll send you a link to reset your password.</p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Secure password recovery</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Instant email delivery</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Back to work in minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form section */}
        <div className="forgot-password-right">
          <div className="forgot-password-form-container">
            <div className="form-header">
              <h2>Forgot your password?</h2>
              <p>We'll send a password reset link to your registered email</p>
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

            {success && (
              <div className="success-banner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className={`input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                      if (success) setSuccess("")
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    placeholder="Enter your registered email"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="form-footer">
                <span>Remembered your password?</span>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword