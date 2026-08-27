import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    ownerId: {
    type: String,
    default: "shared"
},
embedId: {
    type: String,
    required: true,
    unique: true,
    index: true
},
// designConfig's attributes will pass from frontend by the choice of user to the backend (milestone11)
designConfig: {
    primaryColor: { type: String, default: "#000000" },
    logoUrl: { type: String, default: "" }
}
})

export const Calendar = mongoose.model("calendar", calendarSchema)