import dotenv from "dotenv";
dotenv.config();   // ✅ SAB SE PEHLE

import Stripe from "stripe";
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: "price_1UDEbN2LkCmzNvqNt3Eh2Stj",
                    quantity: 1
                }
            ],
            mode: "subscription",
            success_url: "http://localhost:5173/dashboard?payment=success",
            cancel_url: "http://localhost:5173/dashboard?payment=cancelled",
            client_reference_id: req.user.businessId.toString()
        });

        return res.status(200).json({ success: true, url: session.url });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

const createPortalSession = async (req, res) => {
    try {
        const business = await Business.findById(req.user.businessId);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        if (!business.stripeCustomerId) {
            return res.status(400).json({
                success: false,
                message: "No subscription found. Please upgrade first."
            });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: business.stripeCustomerId,
            return_url: "http://localhost:5173/subscription",
        });

        return res.status(200).json({
            success: true,
            url: session.url
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createCheckoutSession,
    createPortalSession
};