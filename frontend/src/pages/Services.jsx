import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal";
import ConfirmModal from "../components/ConfirmModal";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // ✅ Fetch services
    const fetchServices = async () => {
        try {
            console.log("🔍 Fetching services...");
            const response = await api.get("/services");
            console.log("✅ Response:", response.data);

            // ✅ FLEXIBLE — jo bhi field name ho
            const servicesData =
                response.data.Services ||
                response.data.services ||
                Object.values(response.data).find((val) => Array.isArray(val)) ||
                [];

            console.log("✅ Extracted Services:", servicesData);
            setServices(servicesData);
        } catch (error) {
            console.error("❌ Error fetching services:", error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Page load pe call karo
    useEffect(() => {
        fetchServices();
    }, []);

    // ✅ Delete button click — modal kholo
    const handleDeleteClick = (serviceId) => {
        setServiceToDelete(serviceId);
        setShowConfirm(true);
    };

    // ✅ Confirm delete — API call
    const confirmDelete = async () => {
        try {
            await api.delete(`/services/${serviceToDelete}`);
            toast.success("Service deleted successfully!");
            fetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
        } finally {
            setShowConfirm(false);
            setServiceToDelete(null);
        }
    };
    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>💼 Services Management</h1>
                    <p style={styles.subtitle}>Manage your business services here.</p>
                </div>
                <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    + Add Service
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div style={styles.loading}>Loading services...</div>
            ) : services && services.length > 0 ? (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Duration</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Assigned Staff</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{service.name}</strong>
                                        {service.description && (
                                            <p style={styles.description}>
                                                {service.description}
                                            </p>
                                        )}
                                    </td>
                                    <td style={styles.td}>{service.duration} min</td>
                                    <td style={styles.td}>Rs. {service.price}</td>
                                    <td style={styles.td}>
                                        <span style={styles.staffBadge}>
                                            {service.assignedStaffIds?.length || 0} staff
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.editBtn}
                                            onClick={() => {
                                                setSelectedService(service);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            style={styles.deleteBtn}
                                            onClick={() => handleDeleteClick(service._id)}>
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={styles.empty}>
                    <p>No services yet.</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                        Click "+ Add Service" to create your first service.
                    </p>
                </div>
            )}

            {/* Modal */}
            <AddServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onServiceAdded={fetchServices}
            />
            <EditServiceModal
                isOpen={isEditModalOpen}
                service={selectedService}
                onClose={() => setIsEditModalOpen(false)}
                onServiceUpdated={fetchServices}
            />
            <ConfirmModal
                isOpen={showConfirm}
                title="Delete Service?"
                message="Are you sure you want to delete this service? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
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
    description: {
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#94a3b8",
    },
    staffBadge: {
        padding: "4px 10px",
        backgroundColor: "#eef2ff",
        color: "#4F46E5",
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
    deleteBtn: {
        padding: "6px 12px",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
};

export default Services;