import { useEffect } from "react"
import { createPortal } from "react-dom"
import "../../styles/Toast.css"

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 7v4m0 3h.01M9.072 3.32L2.11 15.5A1 1 0 003 17h14a1 1 0 00.89-1.5L10.928 3.32a1 1 0 00-1.856 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 9v5m0-7h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  const toast = (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )

  return createPortal(toast, document.body)
}

export default Toast