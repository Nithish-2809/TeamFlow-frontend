import { useAuthStore } from "../store/auth.store";
import { getUserProfile } from "../api/auth.api";


export const hydrateAuth = async ()=> {
    const { token, setAuth, logoutUser, user } = useAuthStore.getState()

    if (user) {
        useAuthStore.setState({ isAuthReady: true })
        return
    }

    if (!token) {
        useAuthStore.setState({ isAuthReady: true })
        return
    }

    try {
        const profile = await getUserProfile(token)
        setAuth(profile, token)
    }
    catch(err) {
        console.log(err)
        logoutUser()
    }
}
