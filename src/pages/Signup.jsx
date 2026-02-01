import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { signupUser, googleSignupUser } from "../auth/auth.api"
import Toast from "../components/Toast"
import "../styles/Signup.css"

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: ""
  })
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
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
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (profilePic) {
        formData.append("profilePic", profilePic)
      }
      await signupUser(formData)
      showToast("Account created successfully! Redirecting to login...", "success")
      setTimeout(() => {
        navigate("/login",{replace : true})
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Signup failed. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async (credentialResponse) => {
    setError("")
    setLoading(true)
    try {
      await googleSignupUser(credentialResponse.credential)
      showToast("Google signup successful! Redirecting to login...", "success")
      setTimeout(() => {
        navigate("/login",{replace : true})
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Google signup failed. Please try again."
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
      
      <div className="signup-container">
      {/* Left branding section */}
      <div className="signup-left">
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
          <h1 className="brand-title">TeamFlow</h1>
          <p className="brand-tagline">Collaborate seamlessly. Organize efficiently. Execute flawlessly.</p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Real-time collaboration</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Advanced task management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="signup-right">
        <div className="signup-form-container">
          <div className="form-header">
            <h2>Create your account</h2>
            <p>Get started with TeamFlow today</p>
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

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Profile Picture Upload */}
            <div className="profile-upload-section">
              <label className="profile-upload-label">Profile Picture (Optional)</label>
              <div className="profile-upload">
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="profile-input-hidden"
                />
                <label htmlFor="profilePic" className="profile-upload-button">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile preview" className="profile-preview" />
                  ) : (
                    <div className="profile-placeholder">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 26C6 21.5817 9.58172 18 14 18H18C22.4183 18 26 21.5817 26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </label>
                <div className="profile-upload-text">
                  <span className="upload-hint">Click to upload</span>
                  <span className="upload-subhint">PNG, JPG up to 5MB</span>
                </div>
              </div>
            </div>

            <div className={`input-group ${focusedField === 'userName' ? 'focused' : ''}`}>
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                onFocus={() => setFocusedField('userName')}
                onBlur={() => setFocusedField('')}
                required
                placeholder="Enter your username"
              />
            </div>

            <div className={`input-group ${focusedField === 'fullName' ? 'focused' : ''}`}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                required
                placeholder="Enter your full name"
              />
            </div>

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
                  placeholder="Create a password"
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

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign up"
              )}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="google-signin-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => setError("Google signup failed. Please try again.")}
                useOneTap
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
                theme="filled_black"
              />
            </div>

            <div className="form-footer">
              <span>Already have an account?</span>
              <button
                type="button"
                className="link-button"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Signup