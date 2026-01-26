import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export const protectedRoute = ({ children })=> {
    const { user, isAuthReady } = useAuthStore((state)=> ({
        user : state.user,
        isAuthReady : state.isAuthReady
    }))

    if(!user) {
        return <Navigate to = "/login" replace />
    }

    if(!isAuthReady) {
        return <h1>Loading...</h1>
    }

    return children
}