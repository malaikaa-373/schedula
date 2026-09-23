import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const EmbedCode = () => {
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Calendars fetch karo
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await api.get("/calendar");

                // ✅ Flexible — jo bhi field name ho
                const calendarsData =
                    response.data.calendars ||
                    response.data.Calendars ||
                    response.data.calendar ||
                    Object.values(response.data).find((val) => Array.isArray(val)) ||
                    [];

                setCalendars(calendarsData);

                // ✅ First calendar auto-select
                if (calendarsData.length > 0) {
                    setSelectedCalendar(calendarsData[0]);
                }
            } catch (error) {
                console.error("Error fetching calendars:", error);
                toast.error("Failed to load calendars");
            } finally {
                setLoading(false);
            }
        };
        fetchCalendars();
    }, []);

    // ✅ Embed code generate karo
    const getEmbedCode = () => {
        if (!selectedCalendar) return "";

        return `<script 
    src="http://localhost:5173/widget.js" 
    data-calendar-id="${selectedCalendar.embedId}"
></script>`;
    };

    // ✅ Copy to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getEmbedCode());
            toast.success("Code copied to clipboard!");
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy code");
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🔗 Embed Code</h1>
                <p style={styles.subtitle}>
                    Copy the code below and paste it into your website.
                </p>
            </div>

            {loading ? (
                <div style={styles.loading}>Loading calendars...</div>
            ) : calendars.length === 0 ? (
                <div style={styles.empty}>
                    <p>No calendars found.</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "8px" }}>
                        Create a calendar first to generate an embed code.
                    </p>
                </div>
            ) : (
                <>
                    {/* Calendar Selector */}
                    <div style={styles.selectorWrapper}>
                        <label style={styles.label}>Select Calendar:</label>
                        <select
                            value={selectedCalendar?._id || ""}
                            onChange={(e) => {
                                const cal = calendars.find((c) => c._id === e.target.value);
                                setSelectedCalendar(cal);
                            }}
                            style={styles.select}
                        >
                            {calendars.map((cal) => (
                                <option key={cal._id} value={cal._id}>
                                    Calendar {cal._id.slice(-6)} — {cal.embedId.slice(0, 12)}...
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Embed Code Box */}
                    {selectedCalendar && (
                        <div style={styles.codeWrapper}>
                            <div style={styles.codeHeader}>
                                <h3 style={styles.codeTitle}>Your Embed Code:</h3>
                                <button onClick={handleCopy} style={styles.copyBtn}>
                                    📋 Copy Code
                                </button>
                            </div>
                            <pre style={styles.codeBlock}>{getEmbedCode()}</pre>
                        </div>
                    )}

                    {/* Instructions */}
                    <div style={styles.instructions}>
                        <h3 style={styles.instructionsTitle}>📌 How to use:</h3>
                        <ol style={styles.instructionsList}>
                            <li>Copy the embed code above</li>
                            <li>
                                Paste it in your website's HTML (WordPress, Squarespace, plain HTML)
                            </li>
                            <li>The booking widget will appear automatically on your website</li>
                        </ol>
                    </div>
                </>
            )}
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
    selectorWrapper: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "8px",
    },
    select: {
        width: "100%",
        maxWidth: "400px",
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        outline: "none",
    },
    codeWrapper: {
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
    },
    codeHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    codeTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "600",
        color: "#e2e8f0",
    },
    copyBtn: {
        padding: "8px 16px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    codeBlock: {
        backgroundColor: "#0f172a",
        color: "#a5f3fc",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "13px",
        fontFamily: "monospace",
        overflowX: "auto",
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
    },
    instructions: {
        backgroundColor: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
    },
    instructionsTitle: {
        margin: "0 0 12px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#1e293b",
    },
    instructionsList: {
        margin: 0,
        paddingLeft: "20px",
        fontSize: "14px",
        color: "#475569",
        lineHeight: "1.8",
    },
};

export default EmbedCode;