import { useState } from "react";
import api from "../api/axios.js"
import useAuthStore from "../store/authStore.js"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/auth/login', { email, password })
            const { accessToken, user } = response.data
            useAuthStore.getState().login(user, accessToken)
            navigate('/Dashboard')
        } catch (error) {
            console.log(error)
            alert('Login failed. Please check your credentials.')
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    )
}

export default Login