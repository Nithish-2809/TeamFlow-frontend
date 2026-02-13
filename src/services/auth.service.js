import { useAuthStore } from "../store/auth.store"
import { loginUser,googleLoginUser } from "../api/auth.api"


const loginAndSetAuth = async (loginDetails)=> {
    const data = await loginUser(loginDetails)
    useAuthStore.getState().setAuth(data.user,data.token)
    return data.user
}

const googleLoginAndSetAuth = async (idToken) => {
  const { user, token } = await googleLoginUser(idToken)
  useAuthStore.getState().setAuth(user, token)
  return user
}
export {loginAndSetAuth,googleLoginAndSetAuth}

