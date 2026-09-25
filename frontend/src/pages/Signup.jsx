import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        businessName: "",
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);

    // ✅ Password validation function
    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push("Minimum 8 characters");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("1 uppercase letter (A-Z)");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("1 lowercase letter (a-z)");
        }
        if (!/\d/.test(password)) {
            errors.push("1 number (0-9)");
        }
        if (!/[@$!%*?&^#()_\-+=]/.test(password)) {
            errors.push("1 special character (@$!%*?& etc.)");
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        // ✅ Password field ke liye live validation
        if (name === "password") {
            setPasswordErrors(validatePassword(value));
        }

        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // ✅ Password validation check
        const pwdErrors = validatePassword(formData.password);
        if (pwdErrors.length > 0) {
            setPasswordErrors(pwdErrors);
            setError("Please fix password requirements below");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/business-signup", {
                businessName: formData.businessName,
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            const { user, accessToken } = response.data.data;
            useAuthStore.getState().setAuth(user, accessToken);

            toast.success("Business created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup error:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Something went wrong";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🏢 Create Your Business</h2>
                <p style={styles.subtitle}>Start managing your bookings</p>

                {/* ✅ Main error box */}
                {error && (
                    <div style={styles.errorBox}>❌ {error}</div>
                )}

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
                        name="name"
                        placeholder="Your Name (Owner)"
                        value={formData.name}
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
                    />

                    {/* ✅ Password requirements — live */}
                    {formData.password && passwordErrors.length > 0 && (
                        <div style={styles.passwordErrorBox}>
                            <strong style={{ fontSize: "13px" }}>
                                ⚠️ Password must have:
                            </strong>
                            <ul
                                style={{
                                    margin: "6px 0 0 0",
                                    paddingLeft: "20px",
                                    fontSize: "13px",
                                    lineHeight: 1.5,
                                }}
                            >
                                {passwordErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ✅ Password requirements satisfied */}
                    {formData.password && passwordErrors.length === 0 && (
                        <div style={styles.passwordSuccessBox}>
                            ✅ Password is strong
                        </div>
                    )}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Business"}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.link}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "20px",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "440px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1e293b",
        textAlign: "center",
        margin: "0 0 8px 0",
    },
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        textAlign: "center",
        margin: "0 0 24px 0",
    },
    errorBox: {
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: "500",
    },
    passwordErrorBox: {
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        padding: "10px 14px",
        color: "#991b1b",
    },
    passwordSuccessBox: {
        backgroundColor: "#d1fae5",
        border: "1px solid #a7f3d0",
        borderRadius: "8px",
        padding: "8px 14px",
        color: "#065f46",
        fontSize: "13px",
        fontWeight: "500",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    input: {
        padding: "12px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        backgroundColor: "#ffffff",
        color: "#1e293b",
    },
    button: {
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "8px",
    },
    linkText: {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px",
        color: "#64748b",
    },
    link: {
        color: "#4F46E5",
        fontWeight: "600",
        textDecoration: "none",
    },
};

export default Signup;