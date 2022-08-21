const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const sessionSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    verificationToken: {
        type: String,
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Newsletter", sessionSchema);