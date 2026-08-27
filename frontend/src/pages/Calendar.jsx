import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import { useState, useEffect } from "react"
import api from "../api/axios.js"
import { format } from "date-fns"

const Calendar = () => {
    //all  booking data to be shown on calendar
    const [bookings, setBookings] = useState([])

    // dropdown for complete satff list
    const [staffList, setStaffList] = useState([])

    // selected staff in dropmenu
    // empty string ("") = "All Staff" (Shared/Team view)
    // any staffId = specific staff's Individual view
    const [selectedStaffId, setSelectedStaffId] = useState("")

    //after component loading , fetch staff list
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await api.get("/staff")
                setStaffList(response.data.staff)
            } catch (error) {
                console.error(error)
            }
        }

        fetchStaff()
    }, [])

    // fetch booking using staffid that's why added in dependency array
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                //only booking of selected staff
                // otherwise empty fetch all bookings team view 
                const url = selectedStaffId
                    ? `/booking?staffId=${selectedStaffId}`
                    : "/booking"

                const response = await api.get(url)
                setBookings(response.data.booking)
            } catch (error) {
                console.error(error)
            }
        }

        fetchBookings()
    }, [selectedStaffId])

// converting booking fetch from backend into expected shape
    // title consist of  client naam + start-end (readable format ) 
    const events = bookings.map((booking) => ({
        title: `${booking.clientName} (${format(new Date(booking.startTime), "h:mm a")} - ${format(new Date(booking.endTime), "h:mm a")})`,
        start: booking.startTime,
        end: booking.endTime
    }))

    return (
        <div>
            {/* Individual vs Shared/Team view switch dropdown */}
            <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
            >
                <option value="">All Staff (Team View)</option>
                {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                        {staff.name}
                    </option>
                ))}
            </select>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
            />
        </div>
    )
}

export default Calendar