import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../auth/auth.store"
import ConfirmationModal from "./Confirmationmodal"
import "../styles/Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logoutUser } = useAuthStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate("/login", { replace: true })
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Log out of TeamFlow?"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Log out"
        cancelText="Cancel"
        type="warning"
      />

      <nav className="navbar">
        {/* Logo - Home Link */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src="/Logo.png" alt="TeamFlow Logo" className="navbar-logo-img" />
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-right navbar-desktop">
          <button 
            className={`navbar-button ${isActive('/chats') ? 'navbar-button-active' : ''}`}
            onClick={() => handleNavigation("/chats")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73333 17 6.55556 16.6889 5.52778 16.1444L2 17L2.85556 13.4722C2.31111 12.4444 2 11.2667 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Chats</span>
          </button>

          {/* Pending Requests only for admin */}
          {user?.isAdminGlobal && (
            <button 
              className={`navbar-button navbar-button-admin ${isActive('/pending-requests') ? 'navbar-button-active' : ''}`}
              onClick={() => handleNavigation("/pending-requests")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Pending Requests</span>
            </button>
          )}

          <button 
            className={`navbar-button ${isActive('/profile') ? 'navbar-button-active' : ''}`}
            onClick={() => handleNavigation("/profile")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Profile</span>
          </button>

          <button 
            className="navbar-button navbar-button-logout"
            onClick={() => setShowLogoutModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 14L17 10L13 6M17 10H7M7 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="navbar-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-header">
          <div className="navbar-mobile-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="url(#mobileGradient)"/>
              <path d="M10 16L13 19L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="mobileGradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#0052CC"/>
                  <stop offset="100%" stopColor="#2684FF"/>
                </linearGradient>
              </defs>
            </svg>
            <span>TeamFlow</span>
          </div>
          <button className="navbar-mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="navbar-mobile-menu">
          <button 
            className={`navbar-mobile-button ${isActive('/chats') ? 'active' : ''}`}
            onClick={() => handleNavigation("/chats")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73333 17 6.55556 16.6889 5.52778 16.1444L2 17L2.85556 13.4722C2.31111 12.4444 2 11.2667 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Chats</span>
          </button>

          {user?.isAdminGlobal && (
            <button 
              className={`navbar-mobile-button ${isActive('/pending-requests') ? 'active' : ''}`}
              onClick={() => handleNavigation("/pending-requests")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Pending Requests</span>
              <span className="admin-badge">Admin</span>
            </button>
          )}

          <button 
            className={`navbar-mobile-button ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => handleNavigation("/profile")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Profile</span>
          </button>

          <button 
            className="navbar-mobile-button navbar-mobile-button-logout"
            onClick={() => {
              setIsMobileMenuOpen(false)
              setShowLogoutModal(true)
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 14L17 10L13 6M17 10H7M7 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar