import { Service } from "../models/services.models"

const createService = async (req, res) => {
    try {
        // 4.2 Services catalog: name, duration, price, description, assigned staff
        const { name, description, duration, price, assignedStaffIds } = req.body

        if (!name || !description || !price || !duration)
            return res
                .status(400)
                .json({ message: "Invalid Credentials" })

        const newService = await Service.create({
            name: name,
            description: description,
            duration: duration,
            price: price,
            assignedStaffIds: assignedStaffIds,
            businessId: req.user.businessId
        })
        return res
            .status(201)
            .json({ message: "Service created Sucessfully", service: newService })

    } catch (error) {

        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const getServices = async (req, res) => {
    try {
        const newService = await Service.find({
            businessId: req.user.businessId
        })
        return res
            .status(200)
            .json({ Services: newService })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const updateService = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, duration, price, assignedStaffIds } = req.body

        const updates = {}
        if (name) updates.name = name
        if (description) updates.description = description
        if (duration) updates.duration = duration
        if (price) updates.price = price
        if (assignedStaffIds) updates.assignedStaffIds = assignedStaffIds

        const service = await Service.findByIdAndUpdate(
            // fiter by id and businessId to prevent change in business by other (Security)
            {
                _id: id, businessId: req.user.businessId
            },
            updates,
            {
                new: true,
                runValidators: true,
            })

        if (!service)
            return res
                .status(404)
                .json({ success: false, message: "Service not found" })

        return res
            .status(200)
            .json({ success: true, message: "Service updated successfully", service })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const deleteService = async (req, res) => {
    try {
        const { id } = req.params

        const service = await Service.findByIdAndDelete({
            _id: id,
            businessId: req.user.businessId
        })
        if (!service)
            return res
                .status(404)
                .json({ success: false, message: "Service Delete" })

        return res
            .status(200)
            .json({ success: true, message: "Service deleted successfully", service })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export{
    createService,
    getServices,
    updateService,
    deleteService
}