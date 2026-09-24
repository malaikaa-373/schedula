import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import jobs from "./jobs/reminderSender.js";
// Routes
import authRoutes from "./routes/authRoutes.js";
import { router as businessRoutes } from "./routes/businessRoutes.js";
import { router as serviceRoutes } from "./routes/serviceRoutes.js";
import { router as staffRoutes } from "./routes/staffRoutes.js";
import { router as bookingRoutes } from "./routes/bookingRoutes.js";
import { router as calendarRoutes } from "./routes/calendarRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { router as taskRoutes } from "./routes/taskRoutes.js"
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
// Middleware
import { publicLimiter } from "./middleware/rateLimiter.js";
import { embedLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

//SOCKET.IO SETUP

const io = new SocketServer(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://schedula-frontend-ruby.vercel.app"
        ],
        methods: ["GET", "POST"],
    },
});

// Socket Authentication Middleware 
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        console.log(" No token provided");
        return next(new Error("Authentication required"));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        socket.user = {
            _id: decoded._id,
            email: decoded.email,
            businessId: decoded.businessId,
            role: decoded.role,
        };

        console.log(" User authenticated:", decoded._id);
        next();
    } catch (error) {
        console.log(" Invalid token:", error.message);
        return next(new Error("Invalid token"));
    }
});

// Socket Connection Handler 
io.on("connection", (socket) => {
    const { _id, businessId, role } = socket.user;

    console.log("New client connected:", socket.id);
    console.log("User:", _id, "| Business:", businessId, "| Role:", role);

    // User join business room 
    socket.join(`business:${businessId}`);
    console.log(`Joined room: business:${businessId}`);

    // User join personal room 
    socket.join(`user:${_id}`);
    console.log(`Joined room: user:${_id}`);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

//EXPRESS MIDDLEWARE 
app.use(cors());
app.use("/api/webhook", webhookRoutes);

app.use(express.json());

//EXPRESS ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/public", publicLimiter, publicRoutes);
app.use("/api/tasks", taskRoutes)
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/embed/:embedId", embedLimiter, (req, res) => {
    // Frontend React app will serve
});

//TEST ROUTE

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// MONGODB CONNECTION 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(" MongoDB Connected Successfully!");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// SERVER LISTEN 

if (process.env.NODE_ENV !== "test") {
    server.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}

export { io };
export default app;  