import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import AddStaffModal from "../components/AddStaffModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import EditStaffModal from "../components/EditStaffModal.jsx";
import AvailabilityModal from "../components/AvailabilityModal.jsx";

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [staffToDeactivate, setStaffToDeactivate] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [availabilityStaff, setAvailabilityStaff] = useState(null);

    // ✅ 1. fetchStaff Function (useEffect ke BAHAR)
    const fetchStaff = async () => {
        try {
            const response = await api.get("/staff");
            setStaff(response.data.staff || []);
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    // ✅ 2. useEffect (fetchStaff ko call karta hai)
    useEffect(() => {
        fetchStaff();
    }, []);

    // ✅ Deactivate Staff
    // ✅ Yeh naya function — sirf modal kholta hai
    const handleDeactivate = (id) => {
        setStaffToDeactivate(id);
        setShowConfirm(true);
    };

    // ✅ Yeh actual API call karta hai
    const confirmDeactivate = async () => {
        try {
            await api.put(`/staff/${staffToDeactivate}/deactivate`);
            toast.success("Staff deactivated successfully");
            setStaff((prev) =>
                prev.map((s) => (s._id === staffToDeactivate ? { ...s, isActive: false } : s))
            );
        } catch (error) {
            console.error("Error deactivating staff:", error);
            toast.error("Failed to deactivate staff");
        } finally {
            setShowConfirm(false);
            setStaffToDeactivate(null);
        }
    };
    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>👥 Staff Management</h1>
                    <p style={styles.subtitle}>Manage your team members here.</p>
                </div>
                <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    + Add Staff
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div style={styles.loading}>Loading staff...</div>
            ) : staff.length === 0 ? (
                <div style={styles.empty}>
                    <p>No staff members yet.</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                        Click "+ Add Staff" to add your first team member.
                    </p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{member.name}</strong>
                                    </td>
                                    <td style={styles.td}>{member.email}</td>
                                    <td style={styles.td}>
                                        <span style={styles.roleBadge}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor:
                                                    member.isActive === false
                                                        ? "#fee2e2"
                                                        : "#d1fae5",
                                                color:
                                                    member.isActive === false
                                                        ? "#991b1b"
                                                        : "#065f46",
                                            }}
                                        >
                                            {member.isActive === false ? "Inactive" : "Active"}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.editBtn}
                                            onClick={() => {
                                                setSelectedStaff(member);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={styles.deactivateBtn}
                                            onClick={() => handleDeactivate(member._id)}
                                        >
                                            🗑️ Deactivate
                                        </button>
                                        <button
                                            style={styles.availabilityBtn}
                                            onClick={() => {
                                                setAvailabilityStaff(member);
                                                setIsAvailabilityOpen(true);
                                            }}
                                        >
                                            ⏰ Availability
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStaffAdded={fetchStaff}
            />
            <ConfirmModal
                isOpen={showConfirm}
                title="Deactivate Staff?"
                message="Are you sure you want to deactivate this staff member? They will no longer be able to log in."
                onConfirm={confirmDeactivate}
                onCancel={() => setShowConfirm(false)}
            />
            <EditStaffModal
                isOpen={isEditModalOpen}
                staff={selectedStaff}
                onClose={() => setIsEditModalOpen(false)}
                onStaffUpdated={fetchStaff}
            />
            <AvailabilityModal
                isOpen={isAvailabilityOpen}
                staff={availabilityStaff}
                onClose={() => setIsAvailabilityOpen(false)}
                onUpdated={fetchStaff}
            />
        </DashboardLayout>

    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    title: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        margin: "4px 0 0 0",
    },
    addBtn: {
        padding: "10px 20px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    loading: {
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
    },
    empty: {
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        textAlign: "center",
        color: "#64748b",
    },
    tableWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "14px 16px",
        textAlign: "left",
        backgroundColor: "#f8fafc",
        color: "#475569",
        fontSize: "13px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e2e8f0",
    },
    tr: {
        borderBottom: "1px solid #f1f5f9",
    },
    td: {
        padding: "14px 16px",
        fontSize: "14px",
        color: "#1e293b",
    },
    roleBadge: {
        padding: "4px 10px",
        backgroundColor: "#eef2ff",
        color: "#4F46E5",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },
    editBtn: {
        padding: "6px 12px",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
        marginRight: "6px",
    },
    deactivateBtn: {
        padding: "6px 12px",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
    availabilityBtn: {
    padding: "6px 12px",
    backgroundColor: "#eef2ff",
    color: "#4F46E5",
    border: "1px solid #c7d2fe",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    marginRight: "6px",
},
};

export default Staff;