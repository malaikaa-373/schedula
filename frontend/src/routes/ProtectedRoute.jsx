import useAuthStore from "../store/authStore.js";
import { Navigate } from "react-router-dom";

// Wrapper component — protects routes that require login
// Wrap any page/component with this to make it "protected"
const ProtectedRoute = ({ children }) => {

    // get current logged-in user from Zustand auth store
    const { user } = useAuthStore()

    // agar user login nahi hai, redirect to login page
    // this stops rendering the protected page entirely
    if (!user) {
        return <Navigate to="/login" />
    }

    // user login hai, so show whatever was wrapped inside <ProtectedRoute>
    return children
}

export {
    ProtectedRoute
}