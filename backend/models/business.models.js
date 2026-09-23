import mongoose from "mongoose"

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    logo: {
        type: String,
    },
    businessHours: {
        availability: {
            monday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            tuesday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            wednesday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            thursday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            friday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            saturday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
            sunday: {
                isWorking: { type: Boolean, default: false },
                start: { type: String, default: null },
                end: { type: String, default: null }
            },
        },
    },
    timezone: {
        type: String,
        required: true
    },
    subscriptionPlan: {
        type: String,
        enum: ["free", "pro", "business"],
        default: "free"
    },
    subscriptionStatus: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    stripeCustomerId: {
        type: String,
        default: null

    },
    status: {
        type: String,
        enum: ["trial", "active", "suspended"],
        default: "trial"
    },
})

export const Business = mongoose.model("Business", businessSchema)