import {Router} from "express"
import { createBooking,getBookings,updateBookingStatus, } from "../controllers/bookingController.js"
import {auth} from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js";

const router = Router()

router.post("/", auth, createBooking)
router.get("/", auth, getBookings)
router.put("/:id/status", auth, authorize(["admin"]), updateBookingStatus)

export{
    router
}