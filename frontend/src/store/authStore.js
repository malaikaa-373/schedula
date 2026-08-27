import { create } from "zustand"
import { persist } from "zustand/middleware"

//create itself is function
const useAuthStore = create(
    persist(
        (set) => ({
            //current user ---> no user login
            user: null,
            token: null,

            //set user data ---> id,email etc
            login: (userData, token) => set({ user: userData, token: token }),

            //clear user data ---> logout 
            logout: () => set({ user: null, token: null })
        }),
        {
            name: "auth-storage"
        }
    )
)

export default useAuthStore