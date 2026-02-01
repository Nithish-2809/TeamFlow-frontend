import { useEffect } from "react"
import "../styles/ConfirmationModal.css"

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
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

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#FFEBE6"/>
            <circle cx="24" cy="24" r="18" stroke="#DE350B" strokeWidth="2"/>
            <path d="M24 16V26M24 32V32.5" stroke="#DE350B" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )
      case 'info':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#E3F2FD"/>
            <circle cx="24" cy="24" r="18" stroke="#0052CC" strokeWidth="2"/>
            <path d="M24 22V32M24 16V16.5" stroke="#0052CC" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )
      default: // warning
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#FFF4E5"/>
            <circle cx="24" cy="24" r="18" stroke="#FF991F" strokeWidth="2"/>
            <path d="M24 16V26M24 32V32.5" stroke="#FF991F" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          {getIcon()}
        </div>

        <div className="modal-content">
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button 
            className="modal-button modal-button-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`modal-button modal-button-confirm modal-button-${type}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal