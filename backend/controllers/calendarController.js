import crypto from "crypto"
import { Calendar } from "../models/calendar.models.js"
import { Business } from "../models/business.models.js"
import { Service } from "../models/services.models.js"
import { Booking } from "../models/booking.models.js"
import { toUTC } from "../utils/timezone.js"
import { io } from "../server.js";
import { User } from "../models/user.models.js"

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

        // Services fetch karo
        const services = await Service.find({ businessId: calendar.businessId })

        // ✅ Staff bhi fetch karo
        const staff = await User.find({
            businessId: calendar.businessId,
            role: "staff"
        }).select("_id name email")

        return res
            .status(200)
            .json({
                success: true,
                designConfig: calendar.designConfig,
                services: services,
                staff: staff                // ✅ Staff add karo
            })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const createPublicBooking = async (req, res) => {
    console.log("public booking function called");
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

        console.log("Emitting to room:", `business:${calendar.businessId}`);
        io.to(`business:${calendar.businessId}`).emit("booking:created", newBooking);

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

        // 1. Service fetch karo (duration ke liye)
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // 2. Staff fetch karo
        const staff = await User.findById(staffId);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        // 3. Us din ki existing bookings fetch karo — UTC range
        const startOfDay = toUTC(`${date}T00:00:00`);
        const endOfDay = toUTC(`${date}T23:59:59`);

        const existingBookings = await Booking.find({
            staffId: staffId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: "cancelled" }
        });

        // 4. Working hours (PKT)
        const workStart = 9;   // 9 AM PKT
        const workEnd = 18;    // 6 PM PKT
        const slotDuration = service.duration || 30;

        // 5. Available slots generate karo — UTC mein compare
        const availableSlots = [];

        for (let hour = workStart; hour < workEnd; hour++) {
            for (let min = 0; min < 60; min += slotDuration) {
                const slotTimeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                const slotStart = toUTC(`${date}T${slotTimeStr}:00`);
                const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

                // Conflict check — UTC mein
                const hasConflict = existingBookings.some((b) => {
                    const bStart = new Date(b.startTime);
                    const bEnd = new Date(b.endTime);
                    return slotStart < bEnd && slotEnd > bStart;
                });

                if (!hasConflict) {
                    availableSlots.push(slotTimeStr);
                }
            }
        }

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

const getCalendars = async (req, res) => {
    try {
        const calendars = await Calendar.find({
            businessId: req.user.businessId,
        });
        return res.status(200).json({
            success: true,
            calendars,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};
export {
    createCalendar,
    getPublicCalendar,
    createPublicBooking,
    getAvailableSlots,
    getCalendars
}