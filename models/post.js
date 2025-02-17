const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postModel = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["profilePicture", "coverPicture", null],
      default: null,
    },
    images: {
      type: Array,
    },
    text: {
      type: String,
    },
    background: {
      type: String,
    },
    user: {
      type: ObjectId,
      ref: "usermodel",
    },
    comments: [
      {
        comment: {
          type: String,
        },
        image: {
          type: String,
        },
        commentedBy: {
          type: ObjectId,
          ref: "usermodel",
        },
        commentAt: {
          type: Date,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("postData", postModel);
