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
        unique: true,
        sparse: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Newsletter", sessionSchema);