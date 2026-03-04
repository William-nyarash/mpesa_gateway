const mongoose = require('mongoose');

// Transaction model schema
const transactionSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    merchantRequestID: String,
    checkoutRequestID: String,
    resultCode: Number,
    resultDesc: String,
    mpesaReceiptNumber: String,
    transactionDate: Date,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);