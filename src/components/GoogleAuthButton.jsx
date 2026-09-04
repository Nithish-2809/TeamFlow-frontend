import { useEffect, useRef, useState } from "react"
import { GoogleLogin } from "@react-oauth/google"

/**
 * Shared, responsive wrapper around @react-oauth/google's GoogleLogin.
 * - Measures its container with ResizeObserver and re-renders the button
 *   at the correct pixel width, so it never clips or overflows.
 * - Does NOT use useOneTap / FedCM, which is what was causing the
 *   "Failed to open popup window" / "FedCM was disabled" errors on
 *   deployment. Standard button-click popup sign-in is triggered by a
 *   real user gesture, so browsers don't block it.
 */
const GoogleAuthButton = ({ onSuccess, onError, text = "signin_with" }) => {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(300)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width)
      // Google only supports widths up to 400px
      if (w > 0) setWidth(Math.min(w, 400))
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="google-signin-wrapper">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        size="large"
        text={text}
        shape="rectangular"
        theme="filled_black"
        width={width}
        ux_mode="popup"
      />
    </div>
  )
}

export default GoogleAuthButton