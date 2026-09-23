import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, bookingId } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({ success: false, message: "Amount and bookingId are required" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency || "usd",
            metadata: {
                bookingId: bookingId,
                businessId: req.user.businessId.toString()
            }
        });

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

export {
    createPaymentIntent
};