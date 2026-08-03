import { Booking } from "../models/booking.models.js";

const createBooking = async (req,res) =>{
    try {
        const {serviceId, staffId, clientName, clientEmail, startTime, endTime} = req.body

    if (!serviceId || !staffId || !clientName || !clientEmail || ! startTime || ! endTime) {
        return res
        .status(400)
        .json ({ success : false , message : "All credentails are required"})
        
    }

    const conflict = await Booking.findOne({
        staffId:staffId,
        startTime:{$lt:endTime},
        endTime:{$gt:startTime}
    })

    if (conflict) {
        return res
        .status(409)
        .json({success:false , message:"Booking Slot isn't free" })
    }
const newBooking  = await Booking.create({
    serviceId:serviceId,
    staffId:staffId,
    clientEmail:clientEmail,
    clientName:clientName,
    startTime:startTime,
    endTime:endTime,
    source:"dashboard",
    businessId:req.user.businessId
})

    return res
    .status(201)
    .json({success:true, message: "Booking created successfully",Booking:newBooking })

    } catch (error) {
         return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const getBookings = async (req,res) =>{
 try {
        const newBooking = await Booking.find({
            businessId: req.user.businessId
        })
        return res
            .status(200)
            .json({booking: newBooking })
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
                _id: id, businessId: req.user.businessId
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

export{
    createBooking,
    getBookings,
    updateBookingStatus
}