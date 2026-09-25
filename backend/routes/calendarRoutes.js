import { Router } from "express"
import { auth } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
// import {auth} from "../middleware/authenticate.js"
import { createCalendar, getPublicCalendar, createPublicBooking , getCalendars ,getAvailableSlots } from "../controllers/calendarController.js"

const router = Router()

router.get("/", auth, getCalendars)
router.post("/", auth, authorize(["admin"]), createCalendar)
router.get("/public/available-slots", getAvailableSlots)
router.get("/public/:embedId", getPublicCalendar)
router.post("/public/bookings", createPublicBooking)
router.post("/create", auth, createCalendar)

export {
    router
}