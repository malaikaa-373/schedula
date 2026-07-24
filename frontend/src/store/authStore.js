import create from "zustand"

//create itself is function
const useAuthStore = create(set => ({

    //current user ---> no user login
    user: null,

    //set user data ---> id,email etc
    login: userData => set({ user: userData }),

    //clear user data ---> logout 
    logout: () => set({ user: null })
}))

export default useAuthStore