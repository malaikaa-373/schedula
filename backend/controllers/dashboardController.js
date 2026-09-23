import { Booking } from "../models/booking.models.js";
import { User } from "../models/user.models.js";

// ✅ Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const businessId = req.user.businessId;

        // ✅ Aaj ki date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // ✅ Is hafte ki date range (Monday to Sunday)
        const weekStart = new Date(today);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);   // Monday
        weekStart.setDate(diff);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        // ✅ 1. Today's Bookings
        const todayBookings = await Booking.countDocuments({
            businessId,
            startTime: { $gte: today, $lt: tomorrow },
        });

        // ✅ 2. This Week Bookings
        const weekBookings = await Booking.countDocuments({
            businessId,
            startTime: { $gte: weekStart, $lt: weekEnd },
        });

        // ✅ 3. Revenue Estimate (confirmed + completed bookings)
        const revenueData = await Booking.aggregate([
            {
                $match: {
                    businessId: req.user.businessId,
                    startTime: { $gte: weekStart, $lt: weekEnd },
                    status: { $in: ["confirmed", "completed"] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$price" },   // Agar price field hai
                },
            },
        ]);

        const revenueEstimate = revenueData[0]?.total || 0;

        // ✅ 4. Active Staff
        const activeStaff = await User.countDocuments({
            businessId,
            role: "staff",
            isActive: { $ne: false },   // Active ya undefined
        });

        return res.status(200).json({
            success: true,
            stats: {
                todayBookings,
                weekBookings,
                revenueEstimate,
                activeStaff,
            },
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export { getDashboardStats };