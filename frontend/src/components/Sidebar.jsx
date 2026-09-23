// ✅ Sidebar — Dashboard ka left menu

import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    // ✅ Menu Items — Sidebar ke links
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Bookings", path: "/bookings", icon: "📅" },
        { name: "Calendar", path: "/calendar", icon: "🗓️" },
        { name: "Staff", path: "/staff", icon: "👥" },
        { name: "Services", path: "/services", icon: "💼" },
        { name: "Embed Code", path: "/embed-code", icon: "🔗" },
        { name: "Subscription", path: "/subscription", icon: "💳" },
        { name: "Designer", path: "/calendar-designer", icon: "🎨" },
    ];

    // ✅ Logout Function
    const handleLogout = () => {
        logout();                          // Token clear karo
        toast.success("Logged out!");      // Toast dikhao
        navigate("/");                     // Login page pe bhejo
    };

    return (
        <div style={styles.sidebar}>
            {/* ✅ Logo Section */}
            <div style={styles.logo}>
                <h2 style={styles.logoText}>📅 Schedula</h2>
            </div>

            {/* ✅ Menu Links */}
            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {}),
                        })}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* ✅ User Info + Logout */}
            <div style={styles.bottomSection}>
                <div style={styles.userInfo}>
                    <div style={styles.avatar}>
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                        <p style={styles.userName}>{user?.name || "Admin"}</p>
                        <p style={styles.userRole}>{user?.role || "admin"}</p>
                    </div>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

// ✅ Styles
const styles = {
    sidebar: {
        width: "260px",
        height: "100vh",
        backgroundColor: "#1e293b",
        color: "#e2e8f0",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
    },
    logo: {
        padding: "24px 20px",
        borderBottom: "1px solid #334155",
    },
    logoText: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        color: "#ffffff",
    },
    nav: {
        flex: 1,
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
    },
    navLink: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        color: "#cbd5e1",
        textDecoration: "none",
        fontSize: "15px",
        borderLeft: "3px solid transparent",
    },
    navLinkActive: {
        backgroundColor: "#334155",
        color: "#ffffff",
        borderLeft: "3px solid #4F46E5",
    },
    icon: {
        fontSize: "18px",
    },
    bottomSection: {
        padding: "16px 20px",
        borderTop: "1px solid #334155",
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
    },
    userName: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "600",
        color: "#ffffff",
    },
    userRole: {
        margin: 0,
        fontSize: "12px",
        color: "#94a3b8",
        textTransform: "capitalize",
    },
    logoutBtn: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default Sidebar;