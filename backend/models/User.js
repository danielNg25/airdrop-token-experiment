const mongoose = require("mongoose");
const opts = {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};
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
        lastTime: {
            type: Number,
            required: true
        },
        isClaimed: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    opts);

module.exports = mongoose.model("User", UserSchema);