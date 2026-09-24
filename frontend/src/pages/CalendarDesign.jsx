import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const CalendarDesigner = () => {
    const [design, setDesign] = useState({
        primaryColor: "#4F46E5",
        logoUrl: "",
        welcomeText: "Book your appointment with us",
    });
    const [loading, setLoading] = useState(false);
    const [embedId, setEmbedId] = useState(null);

    // ✅ Input change handler
    const handleChange = (e) => {
        setDesign({ ...design, [e.target.name]: e.target.value });
    };

    // ✅ Save Design — API Call
    const handleSave = async () => {
        setLoading(true);

        try {
            const response = await api.post("/calendar/create", {
                primaryColor: design.primaryColor,
                logoUrl: design.logoUrl,
                welcomeText: design.welcomeText,
            });

            const newEmbedId = response.data.calendar?.embedId;
            setEmbedId(newEmbedId);
            toast.success("Calendar created successfully!");
        } catch (error) {
            console.error("Error creating calendar:", error);
            toast.error("Failed to save design");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Copy Embed Code
    const handleCopyCode = () => {
        const code = `<script src="https://schedula-frontend-ruby.vercel.app/widget.js" data-calendar-id="${embedId}"></script>`;
        navigator.clipboard.writeText(code);
        toast.success("Embed code copied!");
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🎨 Calendar Designer</h1>
                    <p style={styles.subtitle}>
                        Customize your booking widget's look and feel
                    </p>
                </div>
            </div>

            <div style={styles.grid}>
                {/* LEFT: Form */}
                <div style={styles.formCard}>
                    <h3 style={styles.cardTitle}>Design Settings</h3>

                    {/* Primary Color */}
                    <div style={styles.field}>
                        <label style={styles.label}>Primary Color</label>
                        <div style={styles.colorRow}>
                            <input
                                type="color"
                                name="primaryColor"
                                value={design.primaryColor}
                                onChange={handleChange}
                                style={styles.colorPicker}
                            />
                            <input
                                type="text"
                                name="primaryColor"
                                value={design.primaryColor}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Logo URL */}
                    <div style={styles.field}>
                        <label style={styles.label}>Logo URL</label>
                        <input
                            type="text"
                            name="logoUrl"
                            placeholder="https://example.com/logo.png"
                            value={design.logoUrl}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Welcome Text */}
                    <div style={styles.field}>
                        <label style={styles.label}>Welcome Text</label>
                        <input
                            type="text"
                            name="welcomeText"
                            placeholder="Book your appointment"
                            value={design.welcomeText}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={styles.saveBtn}
                    >
                        {loading ? "Saving..." : "💾 Save Design"}
                    </button>

                    {/* Embed Code (agar save ho gaya) */}
                    {embedId && (
                        <div style={styles.embedBox}>
                            <p style={styles.embedLabel}>✅ Your Embed Code:</p>
                            <textarea
                                readOnly
                               value={`<script src="https://schedula-frontend-ruby.vercel.app/widget.js" data-calendar-id="${embedId}"></script>`}
                                style={styles.embedCode}
                            />
                            <button onClick={handleCopyCode} style={styles.copyBtn}>
                                📋 Copy Code
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: Live Preview */}
                <div style={styles.previewCard}>
                    <h3 style={styles.cardTitle}>Live Preview</h3>

                    <div
                        style={{
                            ...styles.previewWidget,
                            backgroundColor: design.primaryColor + "15",
                        }}
                    >
                        {/* Logo */}
                        {design.logoUrl ? (
                            <img
                                src={design.logoUrl}
                                alt="Logo"
                                style={styles.previewLogo}
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <div style={styles.previewLogoPlaceholder}>🏢</div>
                        )}

                        {/* Welcome Text */}
                        <h4 style={styles.previewWelcome}>{design.welcomeText}</h4>

                        {/* Service Card */}
                        <div style={styles.previewService}>
                            <strong>Haircut</strong>
                            <span style={styles.previewServiceMeta}>30 min — Rs. 500</span>
                        </div>

                        {/* Staff Card */}
                        <div style={styles.previewStaff}>
                            <span>Staff: Malaika</span>
                        </div>

                        {/* Slot */}
                        <div style={styles.previewSlots}>
                            <button
                                style={{
                                    ...styles.previewSlot,
                                    backgroundColor: design.primaryColor,
                                    color: "white",
                                }}
                            >
                                10:00
                            </button>
                            <button style={styles.previewSlot}>10:30</button>
                            <button style={styles.previewSlot}>11:00</button>
                        </div>

                        {/* Book Button */}
                        <button
                            style={{
                                ...styles.previewBookBtn,
                                backgroundColor: design.primaryColor,
                            }}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const styles = {
    header: {
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
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
    },
    formCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #e2e8f0",
    },
    previewCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #e2e8f0",
    },
    cardTitle: {
        margin: "0 0 20px 0",
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
    },
    field: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "6px",
    },
    colorRow: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
    colorPicker: {
        width: "50px",
        height: "42px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        cursor: "pointer",
    },
    input: {
        flex: 1,
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    saveBtn: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "8px",
    },
    embedBox: {
        marginTop: "20px",
        padding: "16px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "8px",
    },
    embedLabel: {
        margin: "0 0 8px 0",
        fontSize: "13px",
        fontWeight: "600",
        color: "#065f46",
    },
    embedCode: {
        width: "100%",
        padding: "10px",
        fontSize: "12px",
        fontFamily: "monospace",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        resize: "none",
        height: "60px",
        boxSizing: "border-box",
    },
    copyBtn: {
        marginTop: "8px",
        padding: "8px 16px",
        backgroundColor: "#10B981",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
    },
    previewWidget: {
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
    },
    previewLogo: {
        maxHeight: "50px",
        display: "block",
        margin: "0 auto 16px",
    },
    previewLogoPlaceholder: {
        fontSize: "40px",
        textAlign: "center",
        marginBottom: "16px",
    },
    previewWelcome: {
        textAlign: "center",
        fontSize: "16px",
        color: "#1e293b",
        marginBottom: "20px",
    },
    previewService: {
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        border: "1px solid #e2e8f0",
    },
    previewServiceMeta: {
        color: "#64748b",
        fontSize: "12px",
    },
    previewStaff: {
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        fontSize: "13px",
        border: "1px solid #e2e8f0",
    },
    previewSlots: {
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
    },
    previewSlot: {
        flex: 1,
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        fontSize: "12px",
        cursor: "pointer",
    },
    previewBookBtn: {
        width: "100%",
        padding: "12px",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default CalendarDesigner;