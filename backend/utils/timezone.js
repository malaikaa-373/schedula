import { fromZonedTime, toZonedTime } from "date-fns-tz"

const BUSINESS_TIMEZONE = "Asia/Karachi"

const toUTC = (localDateTimeString) => {
    return fromZonedTime(localDateTimeString, BUSINESS_TIMEZONE)
}

const toLocal = (utcDate) => {
    return toZonedTime(utcDate, BUSINESS_TIMEZONE)
}

export {
    toUTC,
    toLocal,
    BUSINESS_TIMEZONE
}



// TIMEZONE HANDLING — READ BEFORE TESTING/DEBUGGING
//
// This app stores everything in UTC (database, calculations) but the
// business operates in BUSINESS_TIMEZONE (local time, e.g. "9 AM" in
// staff availability means 9 AM local, not UTC).
//
// toUTC()   — converts a LOCAL time string -> UTC (used before saving/querying)
// toLocal() — converts a UTC date -> LOCAL time (used only for display)
//
// IMPORTANT: When testing manually (e.g. via Postman), remember that any
// timestamp ending in "Z" is treated as literal UTC, NOT local time.
// Example: Pakistan is UTC+5, so "10:00 AM local" must be sent as
// "05:00:00.000Z" (subtract 5 hours). Sending "10:00:00.000Z" directly
// means 10 AM UTC, which is actually 3 PM local — a common source of bugs
// where bookings don't line up with the availability/slot calculations.