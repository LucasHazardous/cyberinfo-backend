const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Article', articleSchema);
