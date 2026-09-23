import { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

const SuperAdmin = () => {
    const { user, logout } = useAuthStore();
    const [tenants, setTenants] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalBusinesses: 0,
        activeBusinesses: 0,
        totalBookings: 0,
        mrr: 0,
    });
    const [loading, setLoading] = useState(true);

    // ✅ Tenants fetch karo
    const fetchTenants = async () => {
        try {
            const response = await api.get("/admin/tenants");
            const tenantsData =
                response.data.tenants ||
                response.data.Tenants ||
                Object.values(response.data).find((val) => Array.isArray(val)) ||
                [];
            setTenants(tenantsData);
        } catch (error) {
            console.error("Error fetching tenants:", error);
            toast.error("Failed to load tenants");
        }
    };

    // ✅ Analytics fetch karo
    const fetchAnalytics = async () => {
        try {
            const response = await api.get("/admin/analytics");
            setAnalytics(response.data.analytics || {});
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    };

    // ✅ Page load pe call
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchTenants(), fetchAnalytics()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // ✅ Suspend business
    const handleSuspend = async (id) => {
        try {
            await api.put(`/admin/tenants/${id}/suspend`);
            toast.success("Business suspended");
            fetchTenants();
            fetchAnalytics();
        } catch (error) {
            console.error(error);
            toast.error("Failed to suspend business");
        }
    };

    // ✅ Activate business
    const handleActivate = async (id) => {
        try {
            await api.put(`/admin/tenants/${id}/activate`);
            toast.success("Business activated");
            fetchTenants();
            fetchAnalytics();
        } catch (error) {
            console.error(error);
            toast.error("Failed to activate business");
        }
    };

    // ✅ Logout
    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🏢 Super Admin Dashboard</h1>
                    <p style={styles.subtitle}>
                        Platform-wide management & analytics
                    </p>
                </div>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>

            {/* Analytics Cards */}
            <div style={styles.cardsGrid}>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Total Businesses</p>
                    <h2 style={styles.cardValue}>{analytics.totalBusinesses || 0}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Active Businesses</p>
                    <h2 style={{ ...styles.cardValue, color: "#10B981" }}>
                        {analytics.activeBusinesses || 0}
                    </h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Total Bookings</p>
                    <h2 style={styles.cardValue}>{analytics.totalBookings || 0}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Monthly Revenue (MRR)</p>
                    <h2 style={{ ...styles.cardValue, color: "#4F46E5" }}>
                        ${analytics.mrr || 0}
                    </h2>
                </div>
            </div>

            {/* Tenants Table */}
            <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                    <h3 style={styles.tableTitle}>All Businesses ({tenants.length})</h3>
                </div>

                {loading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : tenants.length === 0 ? (
                    <div style={styles.empty}>No businesses found.</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Business Name</th>
                                <th style={styles.th}>Plan</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{tenant.name}</strong>
                                        {tenant.timezone && (
                                            <p style={styles.subtext}>{tenant.timezone}</p>
                                        )}
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.planBadge,
                                                backgroundColor:
                                                    tenant.subscriptionPlan === "pro"
                                                        ? "#dbeafe"
                                                        : tenant.subscriptionPlan === "business"
                                                        ? "#e9d5ff"
                                                        : "#f1f5f9",
                                                color:
                                                    tenant.subscriptionPlan === "pro"
                                                        ? "#1e40af"
                                                        : tenant.subscriptionPlan === "business"
                                                        ? "#6b21a8"
                                                        : "#475569",
                                            }}
                                        >
                                            {tenant.subscriptionPlan || "free"}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor:
                                                    tenant.status === "suspended"
                                                        ? "#fee2e2"
                                                        : tenant.status === "trial"
                                                        ? "#fef3c7"
                                                        : "#d1fae5",
                                                color:
                                                    tenant.status === "suspended"
                                                        ? "#991b1b"
                                                        : tenant.status === "trial"
                                                        ? "#92400e"
                                                        : "#065f46",
                                            }}
                                        >
                                            {tenant.status || "active"}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {tenant.status === "suspended" ? (
                                            <button
                                                style={styles.activateBtn}
                                                onClick={() => handleActivate(tenant._id)}
                                            >
                                                ✅ Activate
                                            </button>
                                        ) : (
                                            <button
                                                style={styles.suspendBtn}
                                                onClick={() => handleSuspend(tenant._id)}
                                            >
                                                ⏸️ Suspend
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "30px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        margin: "4px 0 0 0",
    },
    logoutBtn: {
        padding: "10px 20px",
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    cardLabel: {
        fontSize: "13px",
        color: "#64748b",
        margin: "0 0 8px 0",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: "600",
    },
    cardValue: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    tableWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
    },
    tableHeader: {
        padding: "20px",
        borderBottom: "1px solid #e2e8f0",
    },
    tableTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "700",
        color: "#1e293b",
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
    subtext: {
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#94a3b8",
    },
    planBadge: {
        padding: "4px 10px",
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
        textTransform: "capitalize",
    },
    suspendBtn: {
        padding: "6px 12px",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        border: "1px solid #fde68a",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
    activateBtn: {
        padding: "6px 12px",
        backgroundColor: "#d1fae5",
        color: "#065f46",
        border: "1px solid #a7f3d0",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
    loading: {
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
    },
    empty: {
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
    },
};

export default SuperAdmin;