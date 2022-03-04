const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    nonce: {
        type: Number,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("User", UserSchema);