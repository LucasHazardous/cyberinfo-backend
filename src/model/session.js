const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Session", sessionSchema);