import cron from "node-cron"
import { Booking } from "../models/booking.models.js"
import { sendReminderEmail } from "../utils/mailer.js"

const sendReminders = async () => {
    try {
        console.log("Cron job running at:", new Date())
        const now = new Date()

        // ---- 24-HOUR WINDOW ----
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const bookings24hr = await Booking.find({
            startTime: { $gte: now, $lte: in24Hours },
            reminderSent24hr: false,
            status: "confirmed"
        })

        for (const booking of bookings24hr) {
            await sendReminderEmail(
                booking.clientEmail,
                "Appointment Reminder (24 hours)",
                `Hi ${booking.clientName}, this is a reminder for your appointment tomorrow at ${booking.startTime}.`
            )
            booking.reminderSent24hr = true
            await booking.save()
        }

        // ---- 1-HOUR WINDOW ----
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

        const bookings1hr = await Booking.find({
            startTime: { $gte: now, $lte: oneHourLater },
            reminderSent1hr: false,
            status: "confirmed"
        })

        for (const booking of bookings1hr) {
            await sendReminderEmail(
                booking.clientEmail,
                "Appointment Reminder (1 hour)",
                `Hi ${booking.clientName}, this is a reminder for your appointment soon at ${booking.startTime}.`
            )
            booking.reminderSent1hr = true
            await booking.save()
        }

        console.log(`Processed ${bookings24hr.length} 24hr reminders, ${bookings1hr.length} 1hr reminders`)

    } catch (error) {
        console.error("Error sending reminders:", error.message)
    }
}

if (process.env.NODE_ENV !== "test") {
    cron.schedule("*/1 * * * *", sendReminders);
}
export default sendReminders