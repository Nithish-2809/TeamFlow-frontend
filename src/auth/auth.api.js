import axios from "axios";

const authApi = axios.create({
    baseURL : "http://localhost:2231/api/users",
    withCredentials : true
})

const signupUser = async (signupDetails)=> {
    const res = await authApi.post("/signup",signupDetails)
    return res.data
}

const loginUser = async (loginDetails)=> {
    const res = await authApi.post("/login",loginDetails)
    return res.data
}

const getUserProfile = async (token)=> {
    const res = await authApi.get("/profile",{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    return res.data
}

const googleSignupUser = async (idToken) => {
  const res = await authApi.post("/google-signup", {
    idToken
  })
  return res.data
}

const googleLoginUser = async (idToken) => {
  const res = await authApi.post("/google-login", {
    idToken
  })
  return res.data
}

const forgotPassword = async (email)=> {
  const res = await authApi.post("/forgot-password",{
    email
  })
  return res.data
}

const resetPassword = async (token, passwords) => {
  const res = await authApi.patch(`/reset-password/${token}`, passwords)
  return res.data
}



export {signupUser,loginUser,getUserProfile,googleSignupUser,googleLoginUser,forgotPassword,resetPassword}