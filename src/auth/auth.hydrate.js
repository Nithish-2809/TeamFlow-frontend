import { useAuthStore } from "./auth.store";
import { getUserProfile } from "./auth.api";


export const hydrateAuth = async ()=> {
    const {token,setAuth,logoutUser} = useAuthStore.getState()

    if(!token) {
        useAuthStore.setState({isAuthReady : true})
        return
    }

    try {
        const user = await getUserProfile(token)
        setAuth(user,token)
    }
    catch(err) {
        console.log(err)
        logoutUser()
    }
}