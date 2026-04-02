import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const location = useLocation();

  if (!isAuthReady) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;