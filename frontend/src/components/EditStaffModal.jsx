import { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const EditStaffModal = ({ isOpen, staff, onClose, onStaffUpdated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "staff",
    });
    const [loading, setLoading] = useState(false);

    // ✅ Jab modal khule — staff ka data form mein fill karo
    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name || "",
                email: staff.email || "",
                role: staff.role || "staff",
            });
        }
    }, [staff]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/staff/${staff._id}`, formData);
            toast.success("Staff updated successfully!");
            onStaffUpdated();   // Staff list refresh
            onClose();          // Modal band
        } catch (error) {
            console.error("Error updating staff:", error);
            toast.error(error.response?.data?.message || "Failed to update staff");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>✏️ Edit Staff Member</h3>
                    <button style={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
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

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* Buttons */}
                    <div style={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "450px",
        padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "700",
        color: "#1e293b",
    },
    closeBtn: {
        backgroundColor: "transparent",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
        color: "#94a3b8",
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
        fontSize: "15px",
        outline: "none",
        fontFamily: "inherit",
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        marginTop: "12px",
    },
    cancelBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
    submitBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default EditStaffModal;