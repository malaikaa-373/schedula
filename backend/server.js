import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import {Router} from "express"
import { router as businessRoutes } from "./routes/businessRoutes.js"
import { router as serviceRoutes } from "./routes/serviceRoutes.js"
import {router as staffRoutes} from "./routes/staffRoutes.js"
import {router as bookingRoutes} from "./routes/bookingRoutes.js"
import { router as calendarRoutes } from "./routes/calendarRoutes.js"
import { publicLimiter } from "./middleware/rateLimiter.js";   
import { embedLimiter } from "./middleware/rateLimiter.js";
import publicRoutes from "./routes/publicRoutes.js";   

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/business" , businessRoutes)
app.use("/api/services" , serviceRoutes)
app.use("/api/staff",staffRoutes )
app.use("/api/booking" , bookingRoutes)
app.use("/api/calendar", calendarRoutes)
app.use("/api/public", publicLimiter, publicRoutes);
app.get("/embed/:embedId", embedLimiter, (req, res) => {
    // Frontend React app serve karo
});




app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT,() =>{
    console.log(`Server is running at ${PORT}`);
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.log(' MongoDB Connection Error:', err.message);
    process.exit(1);
  });
  