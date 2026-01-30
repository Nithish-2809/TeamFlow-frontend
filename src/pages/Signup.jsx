import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { signupUser } from "../auth/auth.api"

const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: ""
  })

  const [profilePic, setProfilePic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ------------------ handlers ------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("userName", form.userName)
      formData.append("fullName", form.fullName)
      formData.append("email", form.email)
      formData.append("password", form.password)

      if (profilePic) {
        formData.append("profilePic", profilePic)
      }

      await signupUser(formData)
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  // ------------------ google signup ------------------

  const handleGoogleSignup = async (credentialResponse) => {
    setError("")
    setLoading(true)

    try {
      await axios.post(
        "http://localhost:2231/api/users/google-signup",
        { idToken: credentialResponse.credential }
      )

      // google signup also does NOT login
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.msg || "Google signup failed")
    } finally {
      setLoading(false)
    }
  }

  // ------------------ UI ------------------

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Create your TeamFlow account</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="userName"
            className="form-control"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            name="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Picture (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>

      <hr className="my-4" />

      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => setError("Google signup failed")}
        />
      </div>
    </div>
  )
}

export default Signup
