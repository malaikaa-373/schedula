import rateLimit from "express-rate-limit";

// ✅ Public APIs ke liye strict limiter
export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 15 minutes mein sirf 100 requests allowed per IP
    message: {
        success: false,
        message: "Too many requests. Please try again after 15 minutes."
    },
    standardHeaders: true, // Rate limit info headers bhejo
    legacyHeaders: false, // Purane headers band karo
    skipSuccessfulRequests: false, // Successful requests bhi count hongi
});

// ✅ Embed widget ke liye (thoda strict)
export const embedLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 5 minutes mein 50 requests
    message: {
        success: false,
        message: "Too many requests. Please try again after 5 minutes."
    }
});