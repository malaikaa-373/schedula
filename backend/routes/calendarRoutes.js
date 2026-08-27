import { Router } from "express"
import { auth } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
// import {auth} from "../middleware/authenticate.js"
import { createCalendar, getPublicCalendar, createPublicBooking } from "../controllers/calendarController.js"
import { getAvailableSlots } from "../controllers/bookingController.js"

const router = Router()

router.post("/", auth, authorize(["admin"]), createCalendar)
router.get("/public/available-slots", getAvailableSlots)
router.get("/public/:embedId", getPublicCalendar)
router.post("/public/bookings", createPublicBooking)
router.post("/create", auth, createCalendar);

export {
    router
}