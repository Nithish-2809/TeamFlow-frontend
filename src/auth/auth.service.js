import { useAuthStore } from "./auth.store"
import { loginUser } from "./auth.api"


const loginAndSetAuth = async (loginDetails)=> {
    const data = await loginUser(loginDetails)
    
    useAuthStore.getState().setAuth(data.user,data.token)

    return data.user
}
export {loginAndSetAuth}

