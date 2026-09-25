import { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assigneeId: "",
        priority: "medium",
        dueDate: "",
    });
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Staff list fetch karo
    useEffect(() => {
        if (isOpen) {
            const fetchStaff = async () => {
                try {
                    const response = await api.get("/staff");
                    const staffData =
                        response.data.staff ||
                        response.data.Staff ||
                        Object.values(response.data).find((val) => Array.isArray(val)) ||
                        [];
                    setStaffList(staffData);
                } catch (error) {
                    console.error("Error fetching staff:", error);
                }
            };
            fetchStaff();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.assigneeId) {
            toast.error("Title and assignee are required");
            return;
        }

        setLoading(true);

        try {
            await api.post("/tasks", formData);
            toast.success("Task created successfully!");
            setFormData({
                title: "",
                description: "",
                assigneeId: "",
                priority: "medium",
                dueDate: "",
            });
            onTaskAdded();
            onClose();
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>📋 Add New Task</h3>
                    <button style={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={formData.title}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ ...styles.input, height: "70px" }}
                    />

                    {/* Assignee */}
                    <select
                        name="assigneeId"
                        value={formData.assigneeId}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    >
                        <option value="">-- Select Staff --</option>
                        {staffList.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                                {staff.name}
                            </option>
                        ))}
                    </select>

                    {/* Priority + Due Date */}
                    <div style={styles.row}>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={styles.buttonRow}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={styles.submitBtn}
                        >
                            {loading ? "Adding..." : "Add Task"}
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
        padding: "20px",
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "500px",
        padding: "24px",
        maxHeight: "90vh",
        overflowY: "auto",
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
    row: {
        display: "flex",
        gap: "10px",
    },
    input: {
        padding: "12px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
    },
    buttonRow: {
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

export default AddTaskModal;