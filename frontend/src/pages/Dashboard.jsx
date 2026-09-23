import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import useAuthStore from "../store/authStore";
import { format } from "date-fns";

const Dashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        todayBookings: 0,
        weekBookings: 0,
        revenueEstimate: 0,
        activeStaff: 0,
    });
    const [todayBookings, setTodayBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch stats + today's bookings
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ✅ Stats
                const statsRes = await api.get("/dashboard/stats");
                setStats(statsRes.data.stats || {});

                // ✅ Today's bookings (recent bookings)
                const bookingsRes = await api.get("/booking");
                const bookingsData =
                    bookingsRes.data.bookings ||
                    bookingsRes.data.Booking ||
                    bookingsRes.data.booking ||
                    Object.values(bookingsRes.data).find((val) => Array.isArray(val)) ||
                    [];

                // Aaj ki bookings filter karo
                const today = new Date().toISOString().split("T")[0];
                const todayFiltered = bookingsData.filter(
                    (b) => new Date(b.startTime).toISOString().split("T")[0] === today
                );
                setTodayBookings(todayFiltered.slice(0, 5));   // Top 5
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            {/* Welcome */}
            <div style={styles.welcomeBox}>
                <h1 style={styles.welcome}>
                    Welcome, {user?.name || "Admin"} 👋
                </h1>
                <p style={styles.welcomeSub}>
                    Here's what's happening with your business today.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={styles.cardsGrid}>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Today's Bookings</p>
                    <h2 style={styles.cardValue}>{stats.todayBookings || 0}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>This Week</p>
                    <h2 style={styles.cardValue}>{stats.weekBookings || 0}</h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Revenue (Week)</p>
                    <h2 style={{ ...styles.cardValue, color: "#10B981" }}>
                        Rs. {stats.revenueEstimate || 0}
                    </h2>
                </div>
                <div style={styles.card}>
                    <p style={styles.cardLabel}>Active Staff</p>
                    <h2 style={{ ...styles.cardValue, color: "#4F46E5" }}>
                        {stats.activeStaff || 0}
                    </h2>
                </div>
            </div>

            {/* Today's Bookings */}
            <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                    <h3 style={styles.tableTitle}>📅 Today's Bookings</h3>
                </div>

                {loading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : todayBookings.length === 0 ? (
                    <div style={styles.empty}>No bookings today.</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Client</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayBookings.map((booking) => (
                                <tr key={booking._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{booking.clientName}</strong>
                                        <p style={styles.subtext}>{booking.clientEmail}</p>
                                    </td>
                                    <td style={styles.td}>
                                        {format(new Date(booking.startTime), "h:mm a")}
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor:
                                                    booking.status === "confirmed"
                                                        ? "#d1fae5"
                                                        : booking.status === "cancelled"
                                                        ? "#fee2e2"
                                                        : "#fef3c7",
                                                color:
                                                    booking.status === "confirmed"
                                                        ? "#065f46"
                                                        : booking.status === "cancelled"
                                                        ? "#991b1b"
                                                        : "#92400e",
                                            }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

const styles = {
    welcomeBox: {
        marginBottom: "24px",
    },
    welcome: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    welcomeSub: {
        fontSize: "14px",
        color: "#64748b",
        margin: "4px 0 0 0",
    },
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "24px",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
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
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "capitalize",
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

export default Dashboard;