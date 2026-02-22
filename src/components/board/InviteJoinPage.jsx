import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { validateInviteToken, joinViaInviteLink } from "../../api/invite.api"
import { useAuthStore } from "../../store/auth.store"
import Toast from "../modals/Toast"
import "../../styles/InviteJoinPage.css"

function InviteJoinPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { token: authToken, user } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [inviteValid, setInviteValid] = useState(false)
  const [boardName, setBoardName] = useState("")
  const [toast, setToast] = useState(null)

  // Validate invite token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await validateInviteToken(token)
        setInviteValid(true)
        setBoardName(response.boardName || "this board")
      } catch (error) {
        setInviteValid(false)
        setToast({
          message: error.response?.data?.msg || "Invalid or expired invite link",
          type: "error"
        })
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!validating && !authToken) {
      navigate(`/login?redirect=/invite/${token}`)
    }
  }, [authToken, navigate, token, validating])

  const handleJoinBoard = async () => {
    setLoading(true)
    
    try {
      const response = await joinViaInviteLink(token, authToken)
      
      setToast({
        message: response.msg || "Join request sent successfully!",
        type: "success"
      })

      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setToast({
        message: error.response?.data?.msg || "Failed to join board",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <div className="invite-icon">
            <div className="spinner-large"></div>
          </div>
          <h1>Validating invite...</h1>
        </div>
      </div>
    )
  }

  if (!inviteValid) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <div className="invite-icon error">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#FFEBE6"/>
              <path d="M32 20V36M32 44V44.5" stroke="#DE350B" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="invite-title error">Invalid Invite</h1>
          <p className="invite-description">
            This invite link is invalid or has expired
          </p>
          <button 
            className="invite-cancel-btn"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    )
  }

  if (!authToken) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <div className="invite-icon">
            <div className="spinner-large"></div>
          </div>
          <h1>Redirecting to login...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="invite-page">
      <div className="invite-card">
        <div className="invite-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" fill="#E3F2FD"/>
            <path d="M44 48V44C44 41.8783 43.1571 39.8434 41.6569 38.3431C40.1566 36.8429 38.1217 36 36 36H28C25.8783 36 23.8434 36.8429 22.3431 38.3431C20.8429 39.8434 20 41.8783 20 44V48" stroke="#0052CC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="24" r="6" stroke="#0052CC" strokeWidth="3"/>
            <path d="M44 24V32M40 28H48" stroke="#0052CC" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h1 className="invite-title">You've been invited!</h1>
        <p className="invite-description">
          Join <strong>{boardName}</strong> to collaborate with your team
        </p>

        {user && (
          <div className="invite-user-info">
            <p>Joining as: <strong>{user.userName}</strong></p>
          </div>
        )}

        <button 
          className="invite-join-btn"
          onClick={handleJoinBoard}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Sending Request...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Request to Join</span>
            </>
          )}
        </button>

        <button 
          className="invite-cancel-btn"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default InviteJoinPage