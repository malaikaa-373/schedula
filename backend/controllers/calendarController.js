import crypto from "crypto"
import { Calendar } from "../models/calendar.models.js"
import { Business } from "../models/business.models.js"
import { Service } from "../models/services.models.js"
import { Booking } from "../models/booking.models.js"
import { toUTC } from "../utils/timezone.js"

const createCalendar = async (req, res) => {
    try {
        const { primaryColor, logoUrl, ownerId } = req.body

        const embedId = crypto.randomUUID()

        const newCalendar = await Calendar.create({
            businessId: req.user.businessId,
            embedId: embedId,
            designConfig: { primaryColor, logoUrl },
            ...(ownerId && { ownerId })
        })

        return res
            .status(201)
            .json({ success: true, calendar: newCalendar })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const getPublicCalendar = async (req, res) => {
    try {
        const { embedId } = req.params

        const calendar = await Calendar.findOne({ embedId })

        if (!calendar) {
            return res
                .status(404)
                .json({ success: false, message: "Calendar not found" })
        }

        const business = await Business.findById(calendar.businessId)

        if (business.status === 'suspended') {
            return res
                .status(403)
                .json({ success: false, message: "This business is currently unavailable" })
        }

        const services = await Service.find({ businessId: calendar.businessId })

        return res
            .status(200)
            .json({
                success: true,
                designConfig: calendar.designConfig,
                services: services
            })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const createPublicBooking = async (req, res) => {
    try {
        const {
            embedId,
            serviceId,
            staffId,
            clientName,
            clientEmail,
            startTime,
            endTime
        } = req.body

        if (!embedId || !serviceId || !staffId || !clientName || !clientEmail || !startTime || !endTime) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" })
        }

        const calendar = await Calendar.findOne({ embedId })

        if (!calendar) {
            return res
                .status(404)
                .json({ success: false, message: "Calendar not found" })
        }

        const business = await Business.findById(calendar.businessId)

        if (!business || business.status === 'suspended') {
            return res
                .status(403)
                .json({ success: false, message: "This business is currently unavailable" })
        }

        const utcStartTime = toUTC(startTime)
        const utcEndTime = toUTC(endTime)

        const conflict = await Booking.findOne({
            staffId: staffId,
            startTime: { $lt: utcEndTime },
            endTime: { $gt: utcStartTime }
        })

        if (conflict) {
            return res
                .status(409)
                .json({ success: false, message: "Booking Slot isn't free" })
        }

        const newBooking = await Booking.create({
            serviceId: serviceId,
            staffId: staffId,
            clientName: clientName,
            clientEmail: clientEmail,
            startTime: utcStartTime,
            endTime: utcEndTime,
            source: "embed",
            businessId: calendar.businessId
        })

        return res
            .status(201)
            .json({ success: true, message: "Booking created successfully", booking: newBooking })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}
const getAvailableSlots = async (req, res) => {
    try {
        const { serviceId, staffId, date } = req.query;

        if (!serviceId || !staffId || !date) {
            return res.status(400).json({
                success: false,
                message: "serviceId, staffId, and date are required"
            });
        }

        // 1. Staff ki working hours fetch karo
        // 2. Service duration fetch karo
        // 3. Existing bookings fetch karo
        // 4. Available slots generate karo
        // 5. Return available slots

        const availableSlots = []; // Logic yahan

        return res.status(200).json({
            success: true,
            availableSlots
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

export {
    createCalendar,
    getPublicCalendar,
    createPublicBooking,
    getAvailableSlots
}