const mongoose = require('mongoose');
const { userFabricationActiveMinutes } = require('../config/config');
const { Schema } = mongoose;

const userFabricationSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    fabricationActive: {
      type: Date,
      expires: 60 * userFabricationActiveMinutes,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('UserFabrication', userFabricationSchema);
