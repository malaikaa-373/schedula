import mongoose from "mongoose"

const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        index: true,
        trim: true
    },

    description: {
        type: String,
        required: true

    },

    duration: {
        type: Number,
        required:true
    },

    price: {
        type: Number,
        required: true
    },

    assignedStaffIds: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required:true,
        index:true
    }
})

 

export const Service = mongoose.model("Service", serviceSchema)