import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Filters
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [filterStaff, setFilterStaff] = useState("all");

    // ✅ Fetch bookings
    const fetchBookings = async () => {
        try {
            const response = await api.get("/booking");

            // ✅ Flexible — jo bhi field name ho
            const bookingsData =
                response.data.bookings ||
                response.data.Bookings ||
                response.data.booking ||
                Object.values(response.data).find((val) => Array.isArray(val)) ||
                [];

            setBookings(bookingsData);
        } catch (error) {
            console.error("❌ Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch staff list (filter ke liye)
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

    // ✅ Page load pe call
    useEffect(() => {
        fetchBookings();
        fetchStaff();
    }, []);

    // ✅ Status update
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.put(`/booking/${bookingId}/status`, { status: newStatus });
            // toast.success(`Booking ${newStatus}!`);
            fetchBookings();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update booking");
        }
    };

    // ✅ Clear all filters
    const clearFilters = () => {
        setFilterStatus("all");
        setFilterDate("");
        setFilterStaff("all");
    };

    // ✅ Apply all filters
    const filteredBookings = bookings.filter((b) => {
        // Status filter
        if (filterStatus !== "all" && b.status !== filterStatus) return false;

        // Date filter
        if (filterDate) {
            const bookingDate = new Date(b.startTime).toISOString().split("T")[0];
            if (bookingDate !== filterDate) return false;
        }

        // Staff filter
        if (filterStaff !== "all" && b.staffId !== filterStaff) return false;

        return true;
    });

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📅 Bookings Management</h1>
                    <p style={styles.subtitle}>Manage all your appointments here.</p>
                </div>
            </div>

            {/* Filters Row */}
            <div style={styles.filtersRow}>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={styles.filterInput}
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={styles.filterInput}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    value={filterStaff}
                    onChange={(e) => setFilterStaff(e.target.value)}
                    style={styles.filterInput}
                >
                    <option value="all">All Staff</option>
                    {staffList.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                            {staff.name}
                        </option>
                    ))}
                </select>

                <button onClick={clearFilters} style={styles.clearBtn}>
                    Clear Filters
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div style={styles.loading}>Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
                <div style={styles.empty}>
                    <p>No bookings found.</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "8px" }}>
                        Try changing filters or wait for new bookings.
                    </p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Client</th>
                                <th style={styles.th}>Date & Time</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{booking.clientName}</strong>
                                        <p style={styles.email}>{booking.clientEmail}</p>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(booking.startTime).toLocaleString()}
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
                                                        : booking.status === "completed"
                                                        ? "#dbeafe"
                                                        : "#fef3c7",
                                                color:
                                                    booking.status === "confirmed"
                                                        ? "#065f46"
                                                        : booking.status === "cancelled"
                                                        ? "#991b1b"
                                                        : booking.status === "completed"
                                                        ? "#1e40af"
                                                        : "#92400e",
                                            }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {booking.status === "pending" && (
                                            <>
                                                <button
                                                    style={styles.confirmBtn}
                                                    onClick={() =>
                                                        handleStatusUpdate(booking._id, "confirmed")
                                                    }
                                                >
                                                    ✅ Confirm
                                                </button>
                                                <button
                                                    style={styles.cancelBtn}
                                                    onClick={() =>
                                                        handleStatusUpdate(booking._id, "cancelled")
                                                    }
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </>
                                        )}
                                        {booking.status === "confirmed" && (
                                            <button
                                                style={styles.completeBtn}
                                                onClick={() =>
                                                    handleStatusUpdate(booking._id, "completed")
                                                }
                                            >
                                                ✅ Complete
                                            </button>
                                        )}
                                        {(booking.status === "cancelled" ||
                                            booking.status === "completed") && (
                                            <span style={styles.noAction}>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
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
    filtersRow: {
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
        alignItems: "center",
    },
    filterInput: {
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        minWidth: "150px",
        outline: "none",
    },
    clearBtn: {
        padding: "10px 16px",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
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
    email: {
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
    confirmBtn: {
        padding: "6px 12px",
        backgroundColor: "#d1fae5",
        color: "#065f46",
        border: "1px solid #a7f3d0",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
        marginRight: "6px",
    },
    cancelBtn: {
        padding: "6px 12px",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
    completeBtn: {
        padding: "6px 12px",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        border: "1px solid #bfdbfe",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
    },
    noAction: {
        color: "#94a3b8",
        fontSize: "14px",
    },
};

export default Bookings;