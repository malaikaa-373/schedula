import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["superadmin", "admin", "client", "staff"],
        default: "staff"
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: function () {
            return this.role !== "superadmin";
        }
    },
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
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.isPasswordCorrect = async function
    (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            businessId: this.businessId,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)