import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

const PublicBooking = () => {
    const { embedId } = useParams();

    const [designConfig, setDesignConfig] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingError, setBookingError] = useState("");

    // Detect dark/light mode from designConfig
    const isDark = designConfig?.theme === "dark";
    const primaryColor = designConfig?.primaryColor || "#4F46E5";

    // Theme-based colors
    const theme = {
        bg: isDark ? "#1a1a2e" : "#ffffff",
        bgCard: isDark ? "#16213e" : "#f8fafc",
        text: isDark ? "#e2e8f0" : "#1e293b",
        textSecondary: isDark ? "#94a3b8" : "#64748b",
        border: isDark ? "#334155" : "#e2e8f0",
        hover: isDark ? "#1e293b" : "#f1f5f9",
        inputBg: isDark ? "#0f172a" : "#ffffff",
        shadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
    };

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await api.get(`/calendar/public/${embedId}`);
                setDesignConfig(response.data.designConfig);
                setServices(response.data.services);
            } catch (error) {
                console.error("Error fetching calendar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendar();
    }, [embedId]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (selectedStaff && selectedDate && selectedService) {
                try {
                    const response = await api.get("/calendar/public/available-slots", {
                        params: {
                            embedId: embedId,
                            serviceId: selectedService._id,
                            staffId: selectedStaff,
                            date: selectedDate,
                        },
                    });
                    setAvailableSlots(response.data.availableSlots || []);
                    setSelectedSlot(null);
                    setBookingError("");
                } catch (error) {
                    console.error("Error fetching slots:", error);
                    setAvailableSlots([]);
                }
            }
        };
        fetchSlots();
    }, [selectedStaff, selectedDate, selectedService, embedId]);

    const handleBooking = async () => {
        if (!selectedSlot) {
            setBookingError("Please select a time slot.");
            return;
        }
        if (!clientName || !clientEmail) {
            setBookingError("Please enter your name and email.");
            return;
        }

        try {
            const [hours, minutes] = selectedSlot.split(":");
            const startTime = new Date(selectedDate);
            startTime.setHours(Number(hours), Number(minutes), 0, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

            await api.post("/calendar/public/bookings", {
                embedId: embedId,
                serviceId: selectedService._id,
                staffId: selectedStaff,
                clientName: clientName,
                clientEmail: clientEmail,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            });

            setBookingConfirmed(true);
            setBookingError("");
        } catch (error) {
            console.error("Booking error:", error);
            setBookingError(error.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: isDark ? "#1a1a2e" : "#f8fafc",
                    color: isDark ? "#e2e8f0" : "#1e293b",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            border: `4px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                            borderTop: `4px solid ${primaryColor}`,
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 16px",
                        }}
                    />
                    <p>Loading...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: theme.bg,
                color: theme.text,
                padding: "24px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                minHeight: "100vh",
                transition: "all 0.3s ease",
            }}
        >
            <div
                style={{
                    maxWidth: "640px",
                    margin: "0 auto",
                    backgroundColor: theme.bgCard,
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow: theme.shadow,
                    border: `1px solid ${theme.border}`,
                    transition: "all 0.3s ease",
                }}
            >
                {/* Logo */}
                {designConfig?.logoUrl && (
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <img
                            src={designConfig.logoUrl}
                            alt="Business Logo"
                            style={{
                                maxHeight: "72px",
                                maxWidth: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                )}

                {/* Header */}
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: theme.text,
                        marginBottom: "24px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    Book an Appointment
                </h2>

                {/* Services */}
                <div style={{ marginBottom: "24px" }}>
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: theme.textSecondary,
                            marginBottom: "12px",
                        }}
                    >
                        Choose a Service
                    </h3>
                    {services.length === 0 ? (
                        <p style={{ color: theme.textSecondary, textAlign: "center", padding: "20px 0" }}>
                            No services available.
                        </p>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service._id}
                                onClick={() => {
                                    setSelectedService(service);
                                    setSelectedStaff("");
                                    setSelectedDate("");
                                    setAvailableSlots([]);
                                    setSelectedSlot(null);
                                    setBookingConfirmed(false);
                                    setBookingError("");
                                }}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "14px 18px",
                                    marginBottom: "8px",
                                    borderRadius: "10px",
                                    border:
                                        selectedService?._id === service._id
                                            ? `2px solid ${primaryColor}`
                                            : `1px solid ${theme.border}`,
                                    backgroundColor:
                                        selectedService?._id === service._id
                                            ? isDark
                                                ? `${primaryColor}22`
                                                : `${primaryColor}11`
                                            : "transparent",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedService?._id !== service._id) {
                                        e.currentTarget.style.backgroundColor = theme.hover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedService?._id !== service._id) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }}
                            >
                                <span style={{ fontWeight: "500" }}>{service.name}</span>
                                <span
                                    style={{
                                        fontSize: "13px",
                                        color: theme.textSecondary,
                                        backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                    }}
                                >
                                    {service.duration} min — Rs. {service.price}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Staff + Date + Slots */}
                {selectedService && (
                    <div style={{ marginTop: "24px" }}>
                        {/* Staff */}
                        <div style={{ marginBottom: "20px" }}>
                            <h3
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    color: theme.textSecondary,
                                    marginBottom: "8px",
                                }}
                            >
                                Choose Staff
                            </h3>
                            <select
                                value={selectedStaff}
                                onChange={(e) => {
                                    setSelectedStaff(e.target.value);
                                    setSelectedDate("");
                                    setAvailableSlots([]);
                                    setSelectedSlot(null);
                                    setBookingConfirmed(false);
                                    setBookingError("");
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: `1px solid ${theme.border}`,
                                    backgroundColor: theme.inputBg,
                                    color: theme.text,
                                    fontSize: "15px",
                                    outline: "none",
                                    transition: "all 0.2s ease",
                                    cursor: "pointer",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                                onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
                            >
                                <option value="">-- Select Staff --</option>
                                {selectedService.assignedStaffIds?.map((staff, index) => (
                                    <option key={staff._id || index} value={staff._id || staff}>
                                        {staff.name || `Staff ${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div style={{ marginBottom: "20px" }}>
                            <h3
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    color: theme.textSecondary,
                                    marginBottom: "8px",
                                }}
                            >
                                Choose Date
                            </h3>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setAvailableSlots([]);
                                    setSelectedSlot(null);
                                    setBookingConfirmed(false);
                                    setBookingError("");
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: `1px solid ${theme.border}`,
                                    backgroundColor: theme.inputBg,
                                    color: theme.text,
                                    fontSize: "15px",
                                    outline: "none",
                                    transition: "all 0.2s ease",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                                onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
                            />
                        </div>

                        {/* Slots */}
                        {availableSlots.length > 0 && (
                            <div style={{ marginBottom: "20px" }}>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        color: theme.textSecondary,
                                        marginBottom: "12px",
                                    }}
                                >
                                    Available Slots
                                </h3>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                                        gap: "8px",
                                    }}
                                >
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                                setBookingError("");
                                            }}
                                            style={{
                                                padding: "10px 0",
                                                borderRadius: "8px",
                                                border:
                                                    selectedSlot === slot
                                                        ? `2px solid ${primaryColor}`
                                                        : `1px solid ${theme.border}`,
                                                backgroundColor:
                                                    selectedSlot === slot
                                                        ? primaryColor
                                                        : "transparent",
                                                color: selectedSlot === slot ? "#ffffff" : theme.text,
                                                cursor: "pointer",
                                                fontWeight: selectedSlot === slot ? "600" : "400",
                                                fontSize: "14px",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedSlot !== slot) {
                                                    e.currentTarget.style.borderColor = primaryColor;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedSlot !== slot) {
                                                    e.currentTarget.style.borderColor = theme.border;
                                                }
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {availableSlots.length === 0 && selectedDate && selectedStaff && (
                            <p
                                style={{
                                    color: theme.textSecondary,
                                    textAlign: "center",
                                    padding: "16px 0",
                                    fontStyle: "italic",
                                }}
                            >
                                No slots available for this date.
                            </p>
                        )}

                        {/* Booking Form */}
                        {selectedSlot && !bookingConfirmed && (
                            <div
                                style={{
                                    marginTop: "24px",
                                    borderTop: `1px solid ${theme.border}`,
                                    paddingTop: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        color: theme.textSecondary,
                                        marginBottom: "12px",
                                    }}
                                >
                                    Your Details
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: `1px solid ${theme.border}`,
                                        backgroundColor: theme.inputBg,
                                        color: theme.text,
                                        fontSize: "15px",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                        marginBottom: "12px",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: `1px solid ${theme.border}`,
                                        backgroundColor: theme.inputBg,
                                        color: theme.text,
                                        fontSize: "15px",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                        marginBottom: "12px",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
                                />

                                {bookingError && (
                                    <p
                                        style={{
                                            color: "#ef4444",
                                            fontSize: "14px",
                                            marginBottom: "12px",
                                            backgroundColor: isDark ? "#450a0a" : "#fef2f2",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        ❌ {bookingError}
                                    </p>
                                )}

                                <button
                                    onClick={handleBooking}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        backgroundColor: primaryColor,
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        boxShadow: `0 4px 12px ${primaryColor}44`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = `0 6px 20px ${primaryColor}66`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = `0 4px 12px ${primaryColor}44`;
                                    }}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        )}

                        {/* Confirmation */}
                        {bookingConfirmed && (
                            <div
                                style={{
                                    backgroundColor: isDark ? "#064e3b" : "#d1fae5",
                                    color: isDark ? "#6ee7b7" : "#065f46",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    marginTop: "24px",
                                    textAlign: "center",
                                    border: `1px solid ${isDark ? "#065f46" : "#a7f3d0"}`,
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                                    ✅ Booking Confirmed!
                                </h3>
                                <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
                                    We've sent a confirmation to {clientEmail}.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                    textAlign: "center",
                    padding: "16px 0 8px",
                    fontSize: "12px",
                    color: theme.textSecondary,
                    opacity: 0.6,
                }}
            >
                Powered by <span style={{ color: primaryColor }}>Schedula</span>
            </div>
        </div>
    );
};

export default PublicBooking;