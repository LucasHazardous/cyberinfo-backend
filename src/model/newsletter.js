const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verificationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
