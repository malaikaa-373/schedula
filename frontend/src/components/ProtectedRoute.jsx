import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // ✅ Check karo — token hai ya nahi
    const authData = localStorage.getItem("auth-storage");
    let token = null;

    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            token = parsed?.state?.token;
        } catch (error) {
            console.error("Error parsing auth data:", error);
        }
    }

    // ✅ Agar token nahi hai — login page pe bhejo
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // ✅ Token hai — children render karo
    return children;
};

export default ProtectedRoute;