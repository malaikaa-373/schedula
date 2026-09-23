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
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
        validator: function (v) {
            // At least 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/.test(v);
        },
        message: "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    },
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
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
    },
    tuesday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
    },
    wednesday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
    },
    thursday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
    },
    friday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
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
inviteToken: {
    type: String,
    default: null,
},
inviteExpiry: {
    type: Date,
    default: null,
},
isVerified: {
    type: Boolean,
    default: false,
},
    bufferTime: {
    type: Number,
    default: 0
},
    isActive: {
    type: Boolean,
    default: true
},
},
{
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