import { useEffect } from "react"
import "../styles/Toast.css"

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"
              fill="currentColor"
            />
          </svg>
        )}
        {type === "error" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
              fill="currentColor"
            />
          </svg>
        )}
        {type === "warning" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M1 17h18L10 1 1 17zm10-2H9v-2h2v2zm0-4H9V7h2v4z"
              fill="currentColor"
            />
          </svg>
        )}
        {type === "info" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  )
}

export default Toast