import { Business } from "../models/business.models.js";
import { Booking } from "../models/booking.models.js";

// ✅ 1. Saari Businesses Ki List
const getAllTenants = async (req, res) => {
    try {
        const businesses = await Business.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tenants: businesses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 2. Platform Analytics
const getPlatformAnalytics = async (req, res) => {
    try {
        const totalBusinesses = await Business.countDocuments();
        const activeBusinesses = await Business.countDocuments({ status: "active" });
        const totalBookings = await Booking.countDocuments();

        // MRR — Pro aur Business plans ka sum
        const proCount = await Business.countDocuments({ subscriptionPlan: "pro" });
        const businessCount = await Business.countDocuments({ subscriptionPlan: "business" });

        const mrr = (proCount * 29) + (businessCount * 99);   // Pro = $29, Business = $99

        return res.status(200).json({
            success: true,
            analytics: {
                totalBusinesses,
                activeBusinesses,
                totalBookings,
                mrr
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 3. Business Suspend Karo
const suspendBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndUpdate(
            req.params.id,
            { status: "suspended" },
            { new: true }
        );

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Business suspended successfully",
            business
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 4. Business Activate Karo
const activateBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndUpdate(
            req.params.id,
            { status: "active" },
            { new: true }
        );

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Business activated successfully",
            business
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
    getAllTenants,
    getPlatformAnalytics,
    suspendBusiness,
    activateBusiness
};