import express from "express";
import { publicLimiter } from "../middleware/rateLimiter.js";
import { auth } from "../middleware/authenticate.js";
import { 
    createCalendar, 
    getPublicCalendar, 
    createPublicBooking, 
    getAvailableSlots 
} from "../controllers/calendarController.js";

const router = express.Router();

router.get("/public/available-slots", publicLimiter, getAvailableSlots);
router.get("/public/calendar/:embedId", publicLimiter, getPublicCalendar);
router.post("/public/bookings", publicLimiter, createPublicBooking);

router.post("/admin/create", auth, createCalendar);

router.get("/calendar/:embedId", publicLimiter, getPublicCalendar);

export default router;