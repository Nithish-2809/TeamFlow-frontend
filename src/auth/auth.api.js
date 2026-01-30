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
  const res = await authApi.post("/users/google-signup", {
    idToken
  })
  return res.data
}

const googleLoginUser = async (idToken) => {
  const res = await authApi.post("/users/google-login", {
    idToken
  })
  return res.data
}


export {signupUser,loginUser,getUserProfile,googleSignupUser,googleLoginUser}