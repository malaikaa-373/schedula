import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";

// ✅ 3 Plans — Brief Section 4.8
const PLANS = [
    {
        name: "Free",
        price: 0,
        priceId: null,
        features: [
            "1 Staff Member",
            "1 Embeddable Widget",
            "Basic Booking Engine",
            "Email Reminders",
        ],
    },
    {
        name: "Pro",
        price: 29,
        priceId: "price_1UDEbN2LkCmzNvqNt3Eh2Stj",
        features: [
            "5 Staff Members",
            "5 Embeddable Widgets",
            "Advanced Booking Engine",
            "Email + SMS Reminders",
            "Priority Support",
        ],
    },
    {
        name: "Business",
        price: 99,
        priceId: "price_1UDEbN2LkCmzNvqNt3Eh2Stj",
        features: [
            "Unlimited Staff",
            "Unlimited Widgets",
            "All Features",
            "Custom Integrations",
            "24/7 Support",
        ],
    },
];

const Subscription = () => {
    const [currentPlan, setCurrentPlan] = useState("free");
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    // ✅ Current plan fetch karo
    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                const response = await api.get("/business/me");
                setCurrentPlan(response.data.business?.subscriptionPlan || "free");
            } catch (error) {
                console.error("Error fetching plan:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentPlan();
    }, []);

    // ✅ Upgrade click
    const handleUpgrade = async (plan) => {
        if (plan.name === "Free") return;
        if (plan.name.toLowerCase() === currentPlan.toLowerCase()) return;

        setUpgrading(true);

        try {
            const response = await api.post("/subscription/create-checkout-session", {
                priceId: plan.priceId,
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.error("Failed to start upgrade");
            setUpgrading(false);
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>💳 Subscription</h1>
                    <p style={styles.subtitle}>
                        Manage your subscription plan and billing
                    </p>
                </div>
            </div>

            {/* Current Plan Info */}
            {!loading && (
                <div style={styles.currentPlanBox}>
                    <span style={styles.currentPlanLabel}>Current Plan:</span>
                    <span style={styles.currentPlanValue}>
                        {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                    </span>
                </div>
            )}

            {/* Plans Grid */}
            <div style={styles.plansGrid}>
                {PLANS.map((plan) => {
                    const isCurrent =
                        plan.name.toLowerCase() === currentPlan.toLowerCase();

                    return (
                        <div
                            key={plan.name}
                            style={{
                                ...styles.planCard,
                                borderColor: isCurrent ? "#4F46E5" : "#e2e8f0",
                                borderWidth: isCurrent ? "2px" : "1px",
                            }}
                        >
                            <h3 style={styles.planName}>{plan.name}</h3>

                            {/* Price */}
                            <div style={styles.priceBox}>
                                <span style={styles.priceCurrency}>$</span>
                                <span style={styles.priceAmount}>{plan.price}</span>
                                <span style={styles.pricePeriod}>/month</span>
                            </div>

                            {/* Features */}
                            <ul style={styles.featuresList}>
                                {plan.features.map((feature) => (
                                    <li key={feature} style={styles.featureItem}>
                                        ✅ {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            {isCurrent ? (
                                <button style={styles.currentBtn} disabled>
                                    Current Plan
                                </button>
                            ) : plan.name === "Free" ? (
                                <button style={styles.disabledBtn} disabled>
                                    Free Forever
                                </button>
                            ) : (
                                <button
                                    style={styles.upgradeBtn}
                                    onClick={() => handleUpgrade(plan)}
                                    disabled={upgrading}
                                >
                                    {upgrading
                                        ? "Redirecting..."
                                        : `Upgrade to ${plan.name}`}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Help Text */}
            <div style={styles.helpBox}>
                <p style={styles.helpText}>
                    💡 All payments are handled securely by Stripe. You can upgrade
                    your plan anytime.
                </p>
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
    currentPlanBox: {
        backgroundColor: "#eef2ff",
        padding: "14px 20px",
        borderRadius: "8px",
        marginBottom: "24px",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
    },
    currentPlanLabel: {
        fontSize: "14px",
        color: "#475569",
        fontWeight: "500",
    },
    currentPlanValue: {
        fontSize: "16px",
        color: "#4F46E5",
        fontWeight: "700",
        textTransform: "capitalize",
    },
    plansGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "24px",
    },
    planCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "28px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
    },
    planName: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1e293b",
        margin: "0 0 16px 0",
    },
    priceBox: {
        display: "flex",
        alignItems: "baseline",
        marginBottom: "20px",
    },
    priceCurrency: {
        fontSize: "20px",
        color: "#64748b",
        fontWeight: "600",
    },
    priceAmount: {
        fontSize: "40px",
        fontWeight: "800",
        color: "#1e293b",
        lineHeight: 1,
    },
    pricePeriod: {
        fontSize: "14px",
        color: "#94a3b8",
        marginLeft: "4px",
    },
    featuresList: {
        listStyle: "none",
        padding: 0,
        margin: "0 0 24px 0",
        flex: 1,
    },
    featureItem: {
        fontSize: "14px",
        color: "#475569",
        padding: "6px 0",
    },
    currentBtn: {
        padding: "12px",
        backgroundColor: "#eef2ff",
        color: "#4F46E5",
        border: "1px solid #c7d2fe",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "not-allowed",
    },
    disabledBtn: {
        padding: "12px",
        backgroundColor: "#f1f5f9",
        color: "#94a3b8",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "not-allowed",
    },
    upgradeBtn: {
        padding: "12px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
    helpBox: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
    },
    helpText: {
        margin: 0,
        fontSize: "13px",
        color: "#64748b",
        lineHeight: 1.5,
    },
};

export default Subscription;