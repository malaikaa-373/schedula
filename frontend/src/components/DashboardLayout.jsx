import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={styles.layout}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div style={styles.mainArea} className="main-area">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main style={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const styles = {
    layout: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
    },
    mainArea: {
        marginLeft: "260px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    content: {
        flex: 1,
        padding: "24px 30px",
    },
};

export default DashboardLayout;