import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const clientSecret = searchParams.get("clientSecret");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [postalCode, setPostalCode] = useState("");   // ✅ ADD

    if (!clientSecret) {
        return <div>No payment intent found. Please go back and try again.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!stripe || !elements) {
            setError("Stripe not loaded. Please refresh.");
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: "Customer",
                    address: {
                        postal_code: postalCode,   // ✅ ADD
                    },
                },
            },
        });

        if (paymentError) {
            setError(paymentError.message);
            setLoading(false);
        } else if (paymentIntent.status === "succeeded") {
            alert("✅ Payment successful! Your booking is confirmed.");
            navigate("/dashboard");
        } else {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>💳 Complete Payment</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.cardElementWrapper}>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": { color: "#aab7c4" },
                                    },
                                    invalid: { color: "#9e2146" },
                                },
                            }}
                        />
                    </div>

                    {/* ✅ POSTAL CODE FIELD */}
                    <input
                        type="text"
                        placeholder="Postal Code (e.g., 12345)"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                            marginTop: "8px",
                            boxSizing: "border-box",
                        }}
                        required
                    />

                    {error && <p style={styles.error}>❌ {error}</p>}
                    <button type="submit" disabled={!stripe || loading} style={styles.button}>
                        {loading ? "⏳ Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "20px",
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        width: "100%",
    },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    cardElementWrapper: {
        padding: "12px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
    },
    button: {
        padding: "14px",
        backgroundColor: "#4F46E5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },
    error: { color: "#ef4444", fontSize: "14px", margin: "8px 0 0 0" },
};

export default Checkout;