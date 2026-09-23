const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Title */}
                <h3 style={styles.title}>{title}</h3>

                {/* Message */}
                <p style={styles.message}>{message}</p>

                {/* Buttons */}
                <div style={styles.buttonGroup}>
                    <button onClick={onCancel} style={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={styles.confirmBtn}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    title: {
        margin: "0 0 12px 0",
        fontSize: "18px",
        fontWeight: "700",
        color: "#1e293b",
    },
    message: {
        margin: "0 0 24px 0",
        fontSize: "15px",
        color: "#64748b",
        lineHeight: "1.5",
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
    },
    cancelBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
    confirmBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default ConfirmModal;