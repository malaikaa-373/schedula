import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Modal state
    const [showModal, setShowModal] = useState(false);
    const [newBooking, setNewBooking] = useState({
        clientName: "",
        clientEmail: "",
        serviceId: "",
        staffId: "",
        startTime: "",
    });

    // ✅ Filters
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [filterStaff, setFilterStaff] = useState("all");

    // ✅ Fetch bookings
    const fetchBookings = async () => {
        try {
            const response = await api.get("/booking");
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

    // ✅ Fetch staff
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

    // ✅ Fetch services
    const fetchServices = async () => {
        try {
            const response = await api.get("/services");
            const servicesData =
                response.data.services ||
                response.data.Services ||
                Object.values(response.data).find((val) => Array.isArray(val)) ||
                [];
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchStaff();
        fetchServices();
    }, []);

    // ✅ Create booking
    const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
        // ✅ Step 1: Selected service dhundo
        const selectedService = services.find((s) => s._id === newBooking.serviceId);
        
        if (!selectedService) {
            toast.error("Please select a service");
            return;
        }

        // ✅ Step 2: endTime calculate karo
        const startDate = new Date(newBooking.startTime);
        const endDate = new Date(startDate.getTime() + selectedService.duration * 60000);

        // ✅ Step 3: Payload with endTime
        const payload = {
            ...newBooking,
            endTime: endDate.toISOString(),
            source: "dashboard",
        };

        // ✅ Step 4: Backend ko bhejo
        await api.post("/booking", payload);
        
        toast.success("Booking created successfully!");
        setShowModal(false);
        setNewBooking({
            clientName: "",
            clientEmail: "",
            serviceId: "",
            staffId: "",
            startTime: "",
        });
        fetchBookings();
    } catch (error) {
        console.error("Error creating booking:", error);
        toast.error(error.response?.data?.message || "Failed to create booking");
    }
};

    // ✅ Status update
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.put(`/booking/${bookingId}/status`, { status: newStatus });
            fetchBookings();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update booking");
        }
    };

    // ✅ Clear filters
    const clearFilters = () => {
        setFilterStatus("all");
        setFilterDate("");
        setFilterStaff("all");
    };

    // ✅ Apply filters
    const filteredBookings = bookings.filter((b) => {
        if (filterStatus !== "all" && b.status !== filterStatus) return false;
        if (filterDate) {
            const bookingDate = new Date(b.startTime).toISOString().split("T")[0];
            if (bookingDate !== filterDate) return false;
        }
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
                <button
                    onClick={() => setShowModal(true)}
                    style={styles.addBtn}
                >
                    + Add Booking
                </button>
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
                        Try changing filters or add a new booking.
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
                                                    onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                                >
                                                    ✅ Confirm
                                                </button>
                                                <button
                                                    style={styles.cancelBtn}
                                                    onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </>
                                        )}
                                        {booking.status === "confirmed" && (
                                            <button
                                                style={styles.completeBtn}
                                                onClick={() => handleStatusUpdate(booking._id, "completed")}
                                            >
                                                ✅ Complete
                                            </button>
                                        )}
                                        {(booking.status === "cancelled" || booking.status === "completed") && (
                                            <span style={styles.noAction}>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Add Booking Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>➕ Add New Booking</h2>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateBooking} style={styles.modalForm}>
                            <input
                                type="text"
                                placeholder="Client Name"
                                value={newBooking.clientName}
                                onChange={(e) =>
                                    setNewBooking({ ...newBooking, clientName: e.target.value })
                                }
                                style={styles.modalInput}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Client Email"
                                value={newBooking.clientEmail}
                                onChange={(e) =>
                                    setNewBooking({ ...newBooking, clientEmail: e.target.value })
                                }
                                style={styles.modalInput}
                                required
                            />
                            <select
                                value={newBooking.serviceId}
                                onChange={(e) =>
                                    setNewBooking({ ...newBooking, serviceId: e.target.value })
                                }
                                style={styles.modalInput}
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} — Rs. {s.price}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newBooking.staffId}
                                onChange={(e) =>
                                    setNewBooking({ ...newBooking, staffId: e.target.value })
                                }
                                style={styles.modalInput}
                                required
                            >
                                <option value="">Select Staff</option>
                                {staffList.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="datetime-local"
                                value={newBooking.startTime}
                                onChange={(e) =>
                                    setNewBooking({ ...newBooking, startTime: e.target.value })
                                }
                                style={styles.modalInput}
                                required
                            />

                            <div style={styles.modalButtons}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={styles.modalCancelBtn}
                                >
                                    Cancel
                                </button>
                                <button type="submit" style={styles.modalSubmitBtn}>
                                    Add Booking
                                </button>
                            </div>
                        </form>
                    </div>
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
        gap: "12px",
        flexWrap: "wrap",
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
    // Modal styles
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "480px",
        maxWidth: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "24px",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    modalTitle: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        color: "#1e293b",
    },
    closeBtn: {
        backgroundColor: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        color: "#64748b",
    },
    modalForm: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    modalInput: {
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        color: "#1e293b",
        backgroundColor: "#ffffff",
    },
    modalButtons: {
        display: "flex",
        gap: "10px",
        marginTop: "8px",
    },
    modalCancelBtn: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    modalSubmitBtn: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default Bookings;