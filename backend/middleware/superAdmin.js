// ✅ Super Admin Middleware
const superAdmin = async (req, res, next) => {
    try {
        // req.user authenticate middleware se aata hai
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Check karo role superadmin hai?
        if (req.user.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super Admin only."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

export { superAdmin };