import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            const { user, accessToken } = response.data.data;

            // ✅ Token store karo
            localStorage.setItem("auth-storage", JSON.stringify({
                state: {
                    user: user,
                    token: accessToken
                },
                version: 0
            }));

            // ✅ Dashboard pe redirect karo
            navigate("/dashboard");
            window.location.reload(); // Socket connect karne ke liye

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔐 Login to Schedula</h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ✅ Styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        textAlign: "center",
        marginBottom: "24px",
        color: "#1e293b",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    input: {
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        outline: "none",
        transition: "border 0.2s",
    },
    button: {
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    error: {
        color: "#ef4444",
        fontSize: "14px",
        textAlign: "center",
        marginBottom: "12px",
    },
};

export default Login;