import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
    return (
        <div style={styles.layout}>
            <Sidebar />
            <div style={styles.mainArea}>
                <Header />
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
    },
    content: {
        flex: 1,
        padding: "24px 30px",
    },
};

export default DashboardLayout;