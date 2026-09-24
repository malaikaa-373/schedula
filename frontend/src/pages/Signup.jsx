import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
    const [formData, setFormData] = useState({
        businessName: "",
        ownerName: "",
        email: "",
        password: "",
        timezone: "Asia/Karachi"
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/business-signup`,
                formData
            );

            toast.success("Business created successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🏢 Create Your Business</h2>
                <p style={styles.subtitle}>Start managing your bookings</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="businessName"
                        placeholder="Business Name"
                        value={formData.businessName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="ownerName"
                        placeholder="Your Name (Owner)"
                        value={formData.ownerName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 8 chars, 1 upper, 1 lower, 1 number, 1 special)"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        minLength={8}
                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}"
                        title="Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character"
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Business"}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account?{" "}
                    <Link to="/" style={styles.linkText}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

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
        maxWidth: "420px",
        width: "100%",
    },
    title: {
        textAlign: "center",
        marginBottom: "8px",
        color: "#1e293b",
    },
    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: "24px",
        fontSize: "14px",
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
        marginTop: "8px",
    },
    link: {
        textAlign: "center",
        marginTop: "20px",
        color: "#6b7280",
        fontSize: "14px",
    },
    linkText: {
        color: "#4F46E5",
        fontWeight: "600",
        textDecoration: "none",
    },
};

export default Signup;