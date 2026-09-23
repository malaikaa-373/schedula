import { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const EditServiceModal = ({ isOpen, service, onClose, onServiceUpdated }) => {
    // Form ka data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: 30,
        price: 500,
        assignedStaffIds: [],
    });

    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Jab modal khule — service ka data form mein fill karo
    useEffect(() => {
        if (service && isOpen) {
            setFormData({
                name: service.name || "",
                description: service.description || "",
                duration: service.duration || 30,
                price: service.price || 500,
                assignedStaffIds: service.assignedStaffIds || [],
            });
        }
    }, [service, isOpen]);

    // ✅ Staff list fetch karo (checkbox ke liye)
    useEffect(() => {
        if (isOpen) {
            api.get("/staff")
                .then((res) => setStaffList(res.data.staff || res.data.Staff || []))
                .catch((err) => console.error(err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Input change handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Staff select/deselect
    const handleStaffToggle = (staffId) => {
        if (formData.assignedStaffIds.includes(staffId)) {
            setFormData({
                ...formData,
                assignedStaffIds: formData.assignedStaffIds.filter((id) => id !== staffId),
            });
        } else {
            setFormData({
                ...formData,
                assignedStaffIds: [...formData.assignedStaffIds, staffId],
            });
        }
    };

    // Save button
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/services/${service._id}`, formData);
            toast.success("Service updated!");
            onServiceUpdated();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>✏️ Edit Service</h3>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Service Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ ...styles.input, height: "70px" }}
                    />

                    <div style={styles.row}>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Duration (min)"
                            value={formData.duration}
                            onChange={handleChange}
                            style={styles.input}
                            min="5"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            style={styles.input}
                            min="0"
                            required
                        />
                    </div>

                    {/* Staff Selection */}
                    <div>
                        <p style={styles.label}>Assign Staff:</p>

                        {staffList.length === 0 ? (
                            <p style={styles.noStaff}>No staff available</p>
                        ) : (
                            <div style={styles.staffBox}>
                                {staffList.map((staff) => (
                                    <label key={staff._id} style={styles.staffItem}>
                                        <input
                                            type="checkbox"
                                            checked={formData.assignedStaffIds.includes(staff._id)}
                                            onChange={() => handleStaffToggle(staff._id)}
                                        />
                                        {staff.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div style={styles.buttonRow}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={styles.saveBtn}>
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
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
    },
    modal: {
        backgroundColor: "#fff",
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
        marginBottom: "20px",
    },
    title: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "700",
        color: "#1e293b",
    },
    closeBtn: {
        background: "none",
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
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#475569",
        margin: "0 0 8px 0",
    },
    staffBox: {
        padding: "10px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        maxHeight: "150px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    staffItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        cursor: "pointer",
    },
    noStaff: {
        fontSize: "13px",
        color: "#94a3b8",
        fontStyle: "italic",
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
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
    saveBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default EditServiceModal;