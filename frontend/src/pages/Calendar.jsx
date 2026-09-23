import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { format } from "date-fns";
import DashboardLayout from "../components/DashboardLayout";

// ✅ Colors — har staff ke liye alag
const COLORS = [
    "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16",
];

const Calendar = () => {
    const [bookings, setBookings] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);

    // ✅ Staff list fetch karo
    useEffect(() => {
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
                console.error(error);
            }
        };
        fetchStaff();
    }, []);

    // ✅ Bookings fetch karo (staff filter ke saath)
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const url = selectedStaffId
                    ? `/booking?staffId=${selectedStaffId}`
                    : "/booking";

                const response = await api.get(url);

                const bookingsData =
                    response.data.bookings ||
                    response.data.Booking ||
                    response.data.booking ||
                    Object.values(response.data).find((val) => Array.isArray(val)) ||
                    [];

                setBookings(bookingsData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBookings();
    }, [selectedStaffId]);

    // ✅ Staff ID se color dhoondho
    const getColorForStaff = (staffId) => {
        const index = staffList.findIndex((s) => s._id === staffId);
        return COLORS[index % COLORS.length] || "#4F46E5";
    };

    // ✅ Bookings ko events mein convert karo
    const events = bookings.map((booking) => ({
        id: booking._id,
        title: `${booking.clientName} (${format(
            new Date(booking.startTime),
            "h:mm a"
        )} - ${format(new Date(booking.endTime), "h:mm a")})`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: selectedStaffId ? "#4F46E5" : getColorForStaff(booking.staffId),
        borderColor: selectedStaffId ? "#4338CA" : getColorForStaff(booking.staffId),
        extendedProps: {
            booking: booking,
        },
    }));

    // ✅ Booking pe click — modal kholo
    const handleEventClick = (info) => {
        setSelectedBooking(info.event.extendedProps.booking);
    };

    return (
        <DashboardLayout>
            {/* ✅ Calendar Styling */}
            <style>{`
                .fc-toolbar-title {
                    color: #0f172a !important;
                    font-size: 24px !important;
                    font-weight: 800 !important;
                }
                .fc-col-header-cell-cushion {
                    color: #0f172a !important;
                    font-weight: 700 !important;
                    font-size: 14px !important;
                    text-transform: uppercase !important;
                    padding: 12px 0 !important;
                }
                .fc-daygrid-day-number {
                    color: #0f172a !important;
                    font-weight: 600 !important;
                    font-size: 15px !important;
                    padding: 8px 10px !important;
                }
                .fc-day-today {
                    background-color: #eef2ff !important;
                }
                .fc-button {
                    background-color: #4F46E5 !important;
                    border-color: #4F46E5 !important;
                    color: white !important;
                    text-transform: capitalize !important;
                    font-weight: 600 !important;
                    padding: 8px 14px !important;
                    border-radius: 6px !important;
                }
                .fc-button:hover {
                    background-color: #4338CA !important;
                    border-color: #4338CA !important;
                }
                .fc-event {
                    border: none !important;
                    padding: 3px 6px !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    border-radius: 4px !important;
                    cursor: pointer !important;
                }
                .fc-theme-standard td,
                .fc-theme-standard th {
                    border-color: #e2e8f0 !important;
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🗓️ Calendar View</h1>
                    <p style={styles.subtitle}>
                        {selectedStaffId
                            ? "Individual view — selected staff's bookings"
                            : "Team view — all staff bookings"}
                    </p>
                </div>

                {/* Staff Dropdown */}
                <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="">All Staff (Team View)</option>
                    {staffList.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Calendar */}
            <div style={styles.calendarWrapper}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        style={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>📋 Booking Details</h3>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setSelectedBooking(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Client:</span>
                            <span style={styles.detailValue}>
                                {selectedBooking.clientName}
                            </span>
                        </div>

                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Email:</span>
                            <span style={styles.detailValue}>
                                {selectedBooking.clientEmail}
                            </span>
                        </div>

                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Date:</span>
                            <span style={styles.detailValue}>
                                {format(
                                    new Date(selectedBooking.startTime),
                                    "dd MMM yyyy"
                                )}
                            </span>
                        </div>

                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Time:</span>
                            <span style={styles.detailValue}>
                                {format(new Date(selectedBooking.startTime), "h:mm a")} -{" "}
                                {format(new Date(selectedBooking.endTime), "h:mm a")}
                            </span>
                        </div>

                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Status:</span>
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    backgroundColor:
                                        selectedBooking.status === "confirmed"
                                            ? "#d1fae5"
                                            : selectedBooking.status === "cancelled"
                                            ? "#fee2e2"
                                            : selectedBooking.status === "completed"
                                            ? "#dbeafe"
                                            : "#fef3c7",
                                    color:
                                        selectedBooking.status === "confirmed"
                                            ? "#065f46"
                                            : selectedBooking.status === "cancelled"
                                            ? "#991b1b"
                                            : selectedBooking.status === "completed"
                                            ? "#1e40af"
                                            : "#92400e",
                                }}
                            >
                                {selectedBooking.status}
                            </span>
                        </div>

                        {selectedBooking.source && (
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Source:</span>
                                <span style={styles.detailValue}>
                                    {selectedBooking.source}
                                </span>
                            </div>
                        )}

                        <button
                            style={styles.closeModalBtn}
                            onClick={() => setSelectedBooking(null)}
                        >
                            Close
                        </button>
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
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px",
    },
    title: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    subtitle: {
        fontSize: "14px",
        color: "#2a313b",
        margin: "4px 0 0 0",
    },
    filterSelect: {
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: "#0a0e15",
        minWidth: "200px",
        outline: "none",
    },
    calendarWrapper: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
    },
    modalOverlay: {
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
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    modalTitle: {
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
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #f1f5f9",
    },
    detailLabel: {
        fontSize: "14px",
        color: "#64748b",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: "14px",
        color: "#1e293b",
        fontWeight: "600",
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    closeModalBtn: {
        marginTop: "20px",
        width: "100%",
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

export default Calendar;