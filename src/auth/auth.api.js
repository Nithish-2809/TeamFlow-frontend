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


export {signupUser,loginUser,getUserProfile}