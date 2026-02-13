import { useState } from "react"
import { useAuthStore } from "../store/auth.store"
import { editProfile } from "../api/auth.api"
import ConfirmationModal from "../components/ConfirmationModal"
import "../styles/Profile.css"

function Profile() {
  const { user, token, setAuth } = useAuthStore()
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    userName: user.userName || ""
  })
  const [profilePic, setProfilePic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0])
  }

  const handleEdit = () => {
    setIsEditing(true)
    setMessage("")
    setError("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setForm({
      fullName: user.fullName || "",
      userName: user.userName || ""
    })
    setProfilePic(null)
    setMessage("")
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isEditing) {
      handleEdit()
    } else {
      setShowModal(true)
    }
  }

  const handleConfirmUpdate = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const formData = new FormData()
      formData.append("fullName", form.fullName)
      formData.append("userName", form.userName)
      if (profilePic) {
        formData.append("profilePic", profilePic)
      }

      const res = await editProfile(token, formData)
      setAuth(res.user, token)
      setMessage(res.msg)
      setIsEditing(false)
      setProfilePic(null)
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-card">
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="url(#avatarGradient)"/>
                    <circle cx="40" cy="32" r="12" fill="white" fillOpacity="0.9"/>
                    <path d="M20 65C20 54 28 46 40 46C52 46 60 54 60 65" fill="white" fillOpacity="0.9"/>
                    <defs>
                      <linearGradient id="avatarGradient" x1="0" y1="0" x2="80" y2="80">
                        <stop offset="0%" stopColor="#dfe3eb"/>
                        <stop offset="100%" stopColor="#c9ced4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
              <div className="profile-badge">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (cannot be changed)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePic">Change Profile Picture</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={!isEditing}
                />
                <label htmlFor="profilePic" className="file-input-label">
                  <div className="file-input-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 8L12 3L7 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="file-input-text">
                    <p>
                      {profilePic
                        ? profilePic.name
                        : isEditing
                        ? "Click to upload profile picture"
                        : "No file selected"}
                    </p>
                    <span>{isEditing ? "PNG, JPG up to 5MB" : "Enable edit mode to change"}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>

            {message && (
              <div className="success-message">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 10L9 12L13 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="error-message">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 6V10M10 13V13.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Profile"
        message="Are you sure you want to update your profile information?"
        confirmText="Update"
        cancelText="Cancel"
        type="info"
      />
    </div>
  )
}

export default Profile