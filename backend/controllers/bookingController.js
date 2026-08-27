import { Booking } from "../models/booking.models.js";
import { User } from "../models/user.models.js";
import { Service } from "../models/services.models.js"
import { toUTC, toLocal } from "../utils/timezone.js";
import { format, getDay, addMinutes, isBefore, areIntervalsOverlapping } from "date-fns"

const createBooking = async (req, res) => {
    try {
        const { serviceId, staffId, clientName, clientEmail, startTime, endTime } = req.body

        if (!serviceId || !staffId || !clientName || !clientEmail || !startTime || !endTime) {
            return res
                .status(400)
                .json({ success: false, message: "All credentails are required" })

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
            clientEmail: clientEmail,
            clientName: clientName,
            startTime: startTime,
            endTime: endTime,
            source: "dashboard",
            businessId: req.user.businessId
        })

        return res
            .status(201)
            .json({ success: true, message: "Booking created successfully", Booking: newBooking })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const getBookings = async (req, res) => {
    try {
        const { staffId, startDate, endDate } = req.query
        const filter = { businessId: req.user.businessId }

        if (req.user.role === 'staff') {
            filter.staffId = req.user._id
        } else if (req.user.role === 'admin') {
            if (staffId) filter.staffId = staffId
        }

        if (startDate && endDate) {
            filter.startTime = {
                $gte: toUTC(`${startDate} 00:00`),
                $lte: toUTC(`${endDate} 23:59`)
            }
        }

        const newBookings = await Booking.find(filter)

        return res
            .status(200)
            .json({ success: true, booking: newBookings })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!status)
            return res
                .status(400)
                .json({ success: false, message: "Status is required" })

        const booking = await Booking.findOneAndUpdate(
            // filter by id and businessId to prevent change in business by other (Security)
            {
                _id: id,
                businessId: req.user.businessId
            },
            { status },
            {
                new: true,
                runValidators: true,
            })

        if (!booking)
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" })

        return res
            .status(200)
            .json({ success: true, message: "Booking status updated successfully", booking })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const rescheduleBooking = async (req, res) => {
    try {
        const { id } = req.params
        const { startTime, endTime } = req.body

        if (!startTime || !endTime)
            return res
                .status(400)
                .json({ success: false, message: "startTime and endTime are required" })

        const existingBooking = await Booking.findById(id)

        if (!existingBooking)
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" })

        const conflict = await Booking.findOne({
            staffId: existingBooking.staffId,
            _id: { $ne: id },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        })

        if (conflict)
            return res
                .status(409)
                .json({ success: false, message: "New time slot is not free" })

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: id, businessId: req.user.businessId },
            { startTime, endTime },
            { new: true, runValidators: true }
        )

        return res
            .status(200)
            .json({ success: true, message: "Booking rescheduled successfully", booking: updatedBooking })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

// 4.5 Slot generation based on staff availability, service duration, and existing bookings
const getAvailableSlots = async (req, res) => {
    try {
        // 1: inputs + service
        const { serviceId, staffId, date } = req.query

        if (!serviceId || !staffId || !date) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" })
        }

        const service = await Service.findById(serviceId)
        if (!service) {
            return res
                .status(404)
                .json({ success: false, message: "Service not found" })
        }

        // 2: staff + is this day even a working day
        const staff = await User.findById(staffId)
        if (!staff) {
            return res
                .status(404)
                .json({ success: false, message: "Staff not found" })
        }

        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        const dayIndex = getDay(new Date(date))     // manual version: new Date(date).getDay()
        const dayName = days[dayIndex]
        const dayAvailability = staff.availability[dayName]

        if (!dayAvailability.isWorking) {
            // staff is off this day
            return res
                .status(200)
                .json({ success: true, availableSlots: [] }) // return empty list
        }

        // 3: 
        const dayStartTime = toUTC(`${date} ${dayAvailability.start}`)
        const dayEndTime = toUTC(`${date} ${dayAvailability.end}`)

        const duration = service.duration
        const bufferTime = staff.bufferTime || 0

        //  4: existing bookings for this staff , for this day
        const dayRangeStart = toUTC(`${date} 00:00`)
        const dayRangeEnd = toUTC(`${date} 23:59`)

        const existingBookings = await Booking.find({
            staffId: staffId,
            startTime: { $gte: dayRangeStart, $lte: dayRangeEnd }
        })

        // 5:  duration steps
        const availableSlots = []
        let slotStart = dayStartTime

        // manual version of this while-condition was: currentTime + duration <= endMinutes
        while (isBefore(addMinutes(slotStart, duration), dayEndTime) ||
            +addMinutes(slotStart, duration) === +dayEndTime) {

            const slotEnd = addMinutes(slotStart, duration)

            // check every existing booking — to prevent slot clash with
            // the booking's time and buffer time
            const isBusy = existingBookings.some((booking) => {
                const bufferedBookingEnd = addMinutes(new Date(booking.endTime), bufferTime)

                return areIntervalsOverlapping(
                    { start: slotStart, end: slotEnd },
                    { start: new Date(booking.startTime), end: bufferedBookingEnd }
                )
            })

            // format() turns the Date back into a readable "HH:mm" string for the response
            if (!isBusy) {
                availableSlots.push(format(toLocal(slotStart), "HH:mm"))
            }
            slotStart = addMinutes(slotStart, duration)
        }

        return res
            .status(200)
            .json({ success: true, availableSlots })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export {
    createBooking,
    getBookings,
    updateBookingStatus,
    rescheduleBooking,
    getAvailableSlots
}