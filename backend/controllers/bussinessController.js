import { Business } from "../models/business.models.js"
import { User } from "../models/user.models.js"

// 4.1 Business signup flow: business name, owner email/password
const createBusiness = async (req, res) => {

    try {

        const { businessName, ownerName, timezone, email, password } = req.body

        // 10.2 Code Best Practices (Backend)
        // Never trust client input — validate on the server even if frontend already validates
        if (!businessName || !ownerName || !timezone || !email || !password) {
            return res
                .status(400)
                .json({ message: "All fields are required" })
        }

        // check for duplicate signup — prevent multiple accts
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Email is registered" })
        }

        // 4.1 Business signup creates a new tenat(isolated)
        // 5.1 Core Collections  Business: name and timezone (required fields)
        const newBusiness = await Business.create({
            name: businessName,
            timezone: timezone
        })

        // 4.1 Business owner becomes the admin user for this business
        // 5.1 User: businessId links every user to their tenant
        //  the business creator is always the owner
        const newUser = await User.create({
            name: ownerName,
            password: password,   // gets hashed automatically via pre("save") hook in User model
            email: email,
            role: "admin",
            businessId: newBusiness._id
        })

        // 10.1  never send password back, even hashed
        return res
            .status(201)
            .json({
                message: "User created Successfully",
                user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
            })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }

}

const getBusiness = async (req, res) => {
    try {

        const business = await Business.findById(req.user.businessId)

        if (business) {

            return res
                .status(200)
                .json({ success: true, business })
        }

        if (!business) {
            //  businessId in token doesn't match any existing business
            // (e.g. business was deleted) — respond, don't crash
            return res
                .status(404)
                .json({ success: false, message: "Invalid" })
        }

    } catch (error) {
        // don't let the rejection unhandled it will crash the server (10.2)
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const updateBusiness = async (req, res) => {
    try {
        
        //only required fields are allowed from req.body , never trust client input directly (3.2)
        const { name, logo, timezone, businessHours } = req.body

        // an updates object containing ONLY the fields the client actually sent
        const updates = {} //empty object to add info of any field

        if (name)
            updates.name = name
        if (logo)
            updates.logo = logo
        if (timezone)
            updates.timezone = timezone
        if (businessHours)
            updates.businessHours = businessHours

        // NEVER from the client — admin can only ever update their OWN business
        // runValidators: true-run schema validation rules instead of without checking
        // on update too, since Mongoose skips them by default for findByIdAndUpdate
        const business = await Business.findByIdAndUpdate(
            req.user.businessId,
            updates,
            { new: true, runValidators: true }
        )

        if (business) {
            // 10.1 Every API response follows one consistent shape
            return res
                .status(200)
                .json({ success: true, business })
        }

        if (!business) {

            return res
                .status(404)
                .json({ success: false, message: "Not Found" })
        }

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export {
    createBusiness,
    getBusiness,
    updateBusiness
}