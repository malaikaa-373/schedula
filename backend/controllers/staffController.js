import { User } from "../models/user.models.js"

const addStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            return res
                .status(400)
                .json({ message: "All fields are required" })

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res
                .status(409)
                .json({ message: "Email is registered" })

        const newStaff = await User.create({
            name: name,
            email: email,
            password: password,
            role: "staff",
            businessId: req.user.businessId
        })

        // TODO: upgrade to invite-link flow (brief 4.1) once Nodemailer/email setup exists (Milestone 8)
        return res
            .status(201)
            .json({
                message: "Staff added successfully",
                staff: {
                    _id: newStaff._id,
                    name: newStaff.name,
                    email: newStaff.email,
                    role: newStaff.role
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const getStaff = async (req, res) => {
    try {
        const newStaff = await User.find({
            businessId: req.user.businessId,
            role: "staff"
        })
            .select("-password")
        return res
            .status(200)
            .json({ staff: newStaff })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params
        const { name, availability } = req.body

        const updates = {}
        if (name) updates.name = name
        if (availability) updates.availability = availability

        const staff = await User.findByIdAndUpdate(
            // fiter by id and businessId to prevent change in business by other (Security)
            {
                _id: id, businessId: req.user.businessId
            },
            updates,
            {
                new: true,
                runValidators: true,
            })
            .select("-password")

        if (!staff)
            return res
                .status(404)
                .json({ success: false, message: "Staff can't update" })

        return res
            .status(200)
            .json({ success: true, message: "Staff updated successfully", staff })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const deactivatStaff = async (req, res) => {
    try {
        const { id } = req.params

        const staff = await User.findByIdAndUpdate(
            // fiter by id and businessId to prevent change in business by other (Security)
            {
                _id: id, businessId: req.user.businessId
            },
            {
                isActive: false
            },
            {
                new: true,
            })
            .select("-password")    

            if (!staff)
            return res
                .status(404)
                .json({ success: false, message: "Staff can't deactivate" })

        return res
            .status(200)
            .json({ success: true, message: "Staff deactivated successfully", staff })


    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export{
    addStaff,
    getStaff,
    updateStaff,
    deactivatStaff
}