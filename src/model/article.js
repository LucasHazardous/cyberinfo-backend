const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
        unique: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Article", articleSchema);