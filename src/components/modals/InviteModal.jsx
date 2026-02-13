import { useState, useEffect } from "react"
import { useAuthStore } from "../store/auth.store"
import "../styles/InviteModal.css"

const InviteModal = ({ isOpen, onClose, boardId, boardName }) => {
  const [inviteLink, setInviteLink] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      generateInviteLink()
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const generateInviteLink = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`http://localhost:2231/api/boards/${boardId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to generate invite link')
      }

      setInviteLink(data.inviteLink)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="invite-modal-header">
          <div className="invite-modal-title-section">
            <div className="invite-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8V14M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2>Invite Members</h2>
              <p>Share this link to invite people to <strong>{boardName}</strong></p>
            </div>
          </div>
          <button className="invite-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="invite-modal-content">
          {loading ? (
            <div className="invite-loading">
              <div className="spinner"></div>
              <p>Generating invite link...</p>
            </div>
          ) : error ? (
            <div className="invite-error">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#FFEBE6"/>
                <circle cx="24" cy="24" r="18" stroke="#DE350B" strokeWidth="2"/>
                <path d="M24 16V26M24 32V32.5" stroke="#DE350B" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
              <button className="retry-button" onClick={generateInviteLink}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="invite-link-wrapper">
                <input 
                  type="text" 
                  value={inviteLink} 
                  readOnly 
                  className="invite-link-input"
                  onClick={(e) => e.target.select()}
                />
                <button 
                  className={`copy-button ${copied ? 'copied' : ''}`}
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="5.33334" y="5.33337" width="9.33333" height="9.33333" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.33334 10.6667H2.66667C2.31305 10.6667 1.97391 10.5262 1.72386 10.2762C1.47381 10.0262 1.33334 9.68702 1.33334 9.33337V2.66671C1.33334 2.31309 1.47381 1.97395 1.72386 1.7239C1.97391 1.47385 2.31305 1.33337 2.66667 1.33337H9.33334C9.68696 1.33337 10.0261 1.47385 10.2761 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V3.33337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="invite-info">
                <div className="info-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Link expires in 10 days</span>
                </div>
                <div className="info-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 11C11.6569 11 13 9.65685 13 8C13 6.34315 11.6569 5 10 5C8.34315 5 7 6.34315 7 8C7 9.65685 8.34315 11 10 11Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 18V16C3 14.9391 3.42143 13.9217 4.17157 13.1716C4.92172 12.4214 5.93913 12 7 12H13C14.0609 12 15.0783 12.4214 15.8284 13.1716C16.5786 13.9217 17 14.9391 17 16V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>New members need admin approval</span>
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && !error && (
          <div className="invite-modal-footer">
            <button className="modal-button modal-button-secondary" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InviteModal