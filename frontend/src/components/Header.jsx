// ✅ Header — Dashboard ka top bar (Welcome + Notification Bell)

import { useState } from "react";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notifications";

const Header = () => {
    const { user } = useAuthStore();
    const { notifications, markAsRead } = useNotificationStore();

    // ✅ Notification dropdown open/close karne ke liye state
    const [showNotifications, setShowNotifications] = useState(false);

    // ✅ Unread notifications ka count
    const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

    return (
        <div style={styles.header}>
            {/* ✅ LEFT: Welcome Message */}
            <div>
                <h2 style={styles.title}>
                    Welcome, {user?.name || "Admin"} 👋
                </h2>
                <p style={styles.subtitle}>
                    Here's what's happening with your business today.
                </p>
            </div>

            {/* ✅ RIGHT: Notification Bell */}
            <div style={styles.rightSection}>
                <div style={styles.bellWrapper}>
                    {/* Bell Button */}
                    <button
                        style={styles.bellBtn}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        🔔
                        {/* ✅ Agar unread hain toh badge dikhao */}
                        {unreadCount > 0 && (
                            <span style={styles.badge}>{unreadCount}</span>
                        )}
                    </button>

                    {/* ✅ Dropdown — jab bell click ho */}
                    {showNotifications && (
                        <div style={styles.dropdown}>
                            <div style={styles.dropdownHeader}>
                                <h4 style={styles.dropdownTitle}>Notifications</h4>
                            </div>

                            {/* Agar notifications hain toh list dikhao */}
                            {notifications?.length > 0 ? (
                                notifications.slice(0, 5).map((notif) => (
                                    <div
                                        key={notif._id}
                                        style={{
                                            ...styles.notifItem,
                                            backgroundColor: notif.isRead
                                                ? "transparent"
                                                : "#eef2ff",
                                        }}
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <p style={styles.notifMessage}>
                                            {notif.message}
                                        </p>
                                        <p style={styles.notifTime}>
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noNotif}>No notifications</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ✅ Styles
const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
    },
    title: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "700",
        color: "#1e293b",
    },
    subtitle: {
        margin: "4px 0 0 0",
        fontSize: "14px",
        color: "#64748b",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    bellWrapper: {
        position: "relative",
    },
    bellBtn: {
        position: "relative",
        backgroundColor: "#f1f5f9",
        border: "none",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        fontSize: "20px",
        cursor: "pointer",
    },
    badge: {
        position: "absolute",
        top: "-4px",
        right: "-4px",
        backgroundColor: "#ef4444",
        color: "#ffffff",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        fontSize: "11px",
        fontWeight: "700",
    },
    dropdown: {
        position: "absolute",
        top: "54px",
        right: 0,
        width: "320px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        border: "1px solid #e2e8f0",
        zIndex: 1000,
    },
    dropdownHeader: {
        padding: "14px 16px",
        borderBottom: "1px solid #e2e8f0",
    },
    dropdownTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: "600",
        color: "#1e293b",
    },
    notifItem: {
        padding: "12px 16px",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
    },
    notifMessage: {
        margin: 0,
        fontSize: "14px",
        color: "#1e293b",
    },
    notifTime: {
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#94a3b8",
    },
    noNotif: {
        padding: "20px",
        textAlign: "center",
        color: "#94a3b8",
    },
};

export default Header;