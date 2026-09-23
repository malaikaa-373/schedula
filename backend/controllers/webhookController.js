import Stripe from "stripe";
import { Booking } from "../models/booking.models.js";
import { Business } from "../models/business.models.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Signature verified. Event:", event.type);
    } catch (err) {
        console.log(" Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Event Handle
    try {
        switch (event.type) {
          case "payment_intent.succeeded": {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    // DEBUG LOGS 
    console.log("Full metadata:", JSON.stringify(paymentIntent.metadata));
    console.log("Booking ID:", bookingId);

    if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: "paid",
            status: "confirmed"
        });
        console.log(`Booking ${bookingId} confirmed`);
    } else {
        console.log("No bookingId found in metadata!");
    }
    break;
}

            case "checkout.session.completed": {
                const session = event.data.object;
                const businessId = session.client_reference_id;

                if (businessId) {
                    await Business.findByIdAndUpdate(businessId, {
                        subscriptionPlan: "pro",
                        stripeCustomerId: session.customer,
                        subscriptionStatus: "active"
                    });
                    console.log(`Business ${businessId} upgraded to Pro`);
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                await Business.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    { subscriptionPlan: "free", subscriptionStatus: "cancelled" }
                );
                console.log(`Subscription cancelled`);
                break;
            }

            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.log(" Handler error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export { handleWebhook };