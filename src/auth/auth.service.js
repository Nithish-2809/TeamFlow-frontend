import { useAuthStore } from "./auth.store"
import { loginUser,googleLoginUser } from "./auth.api"


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

