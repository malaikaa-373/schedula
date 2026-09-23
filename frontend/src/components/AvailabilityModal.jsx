import { useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

// 7 Days Ki List
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const AvailabilityModal = ({ isOpen, staff, onClose, onUpdated }) => {
    // Har din ki timing save karne ke liye
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);

    // Jab modal khule — staff ki purani availability load karo
    useEffect(() => {
        if (staff && isOpen) {
            const initialData = {};

            DAYS.forEach((day) => {
                const saved = staff.availability?.[day] || {};
                
                initialData[day] = {
                    start: saved.start || "09:00",
                    end: saved.end || "17:00",
                    buffer: saved.buffer || 15,
                    isOff: !saved.start || !saved.end,
                };
            });

            setAvailability(initialData);
        }
    }, [staff, isOpen]);

    if (!isOpen) return null;

    // Jab user koi field change kare
    const handleChange = (day, field, value) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }));
    };

    // Jab "Off" checkbox click kare
    const handleOffToggle = (day) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: { ...prev[day], isOff: !prev[day].isOff },
        }));
    };

    // Save button — API call
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Data ko clean karo
            const finalData = {};
            DAYS.forEach((day) => {
                const d = availability[day];
                finalData[day] = d.isOff
                    ? { start: null, end: null, buffer: d.buffer }
                    : { start: d.start, end: d.end, buffer: d.buffer };
            });

            await api.put(`/staff/${staff._id}/availability`, {
                availability: finalData,
            });

            toast.success("Availability updated!");
            onUpdated();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update availability");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>⏰ Staff Availability</h3>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <p style={styles.subtitle}>
                    Set working hours for <strong>{staff?.name}</strong>
                </p>

                {/* Form */}
                <form onSubmit={handleSave}>
                    {DAYS.map((day) => (
                        <div key={day} style={styles.dayRow}>
                            
                            {/* Day Name */}
                            <span style={styles.dayName}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </span>

                            {/* Agar Off nahi hai — time dikhao */}
                            {!availability[day]?.isOff && (
                                <>
                                    <input
                                        type="time"
                                        value={availability[day]?.start || "09:00"}
                                        onChange={(e) => handleChange(day, "start", e.target.value)}
                                        style={styles.timeInput}
                                    />
                                    <span style={styles.toText}>to</span>
                                    <input
                                        type="time"
                                        value={availability[day]?.end || "17:00"}
                                        onChange={(e) => handleChange(day, "end", e.target.value)}
                                        style={styles.timeInput}
                                    />
                                    <input
                                        type="number"
                                        value={availability[day]?.buffer || 15}
                                        onChange={(e) => handleChange(day, "buffer", e.target.value)}
                                        style={styles.bufferInput}
                                        min="0"
                                    />
                                    <span style={styles.minText}>min buffer</span>
                                </>
                            )}

                            {/* Agar Off hai — "Off" dikhao */}
                            {availability[day]?.isOff && (
                                <span style={styles.offText}>Off (Chhutti)</span>
                            )}

                            {/* Off Checkbox */}
                            <label style={styles.offCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={availability[day]?.isOff || false}
                                    onChange={() => handleOffToggle(day)}
                                />
                                Off
                            </label>
                        </div>
                    ))}

                    {/* Buttons */}
                    <div style={styles.buttonRow}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={styles.saveBtn}>
                            {loading ? "Saving..." : "Save Availability"}
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
        maxWidth: "700px",
        padding: "24px",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "6px",
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
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        marginBottom: "20px",
    },
    dayRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        marginBottom: "8px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        flexWrap: "wrap",
    },
    dayName: {
        width: "90px",
        fontWeight: "600",
        fontSize: "14px",
        color: "#1e293b",
    },
    timeInput: {
        padding: "8px",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "14px",
        width: "100px",
    },
    toText: {
        fontSize: "13px",
        color: "#64748b",
    },
    bufferInput: {
        padding: "8px",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "14px",
        width: "60px",
    },
    minText: {
        fontSize: "13px",
        color: "#64748b",
    },
    offText: {
        color: "#94a3b8",
        fontSize: "14px",
        fontStyle: "italic",
    },
    offCheckbox: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#64748b",
        cursor: "pointer",
    },
    buttonRow: {
        display: "flex",
        gap: "10px",
        marginTop: "16px",
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

export default AvailabilityModal;