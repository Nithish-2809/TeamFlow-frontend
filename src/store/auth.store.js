import { create } from "zustand";

const useAuthStore = create((set)=> ({
    user : null,
    token : localStorage.getItem("token"),
    isAuthReady : false,

    setAuth : (user, token)=> {
        if(token) {
            localStorage.setItem("token", token)
        }

        set({
            user,
            token,
            isAuthReady : true
        })
    },

    logoutUser : ()=> {
        localStorage.removeItem("token")

        set({
            user : null,
            token : null,
            isAuthReady : true
        })
    }
}))

export { useAuthStore }
