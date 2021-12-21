const mongoose = require('mongoose')

const tipSchema = mongoose.Schema({
    place: {
        type: String,
        required: true,
        trim: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    tipPercentage: {
        type: Number,
        required: true
    },
    tipAmount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{ timestamps: { createdAt: true, updatedAt: false }})

const Tip = mongoose.model('Tip', tipSchema)

module.exports = Tip