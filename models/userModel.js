const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const userModel = new Schema(
  {
    fname: {
      type: String,
      require: true,
      text: true,
      trim: true,
    },
    lname: {
      type: String,
      require: true,
      text: true,
      trim: true,
    },
    username: {
      type: String,
      require: true,
      text: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      text: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
      trim: true,
    },
    coverPicture: {
      type: String,
      trim: true,
    },
    bdate: {
      type: Number,
      trim: true,
      require: true,
    },
    bmonth: {
      type: Number,
      trim: true,
      require: true,
    },
    byear: {
      type: Number,
      trim: true,
      require: true,
    },
    gender: {
      type: String,
      trim: true,
      require: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: ObjectId,
        ref: "usermodel",
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: "usermodel",
      },
    ],
    blockedUsers: [
      {
        type: ObjectId,
        ref: "usermodel",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "usermodel",
      },
    ],
    request: [
      {
        type: ObjectId,
        ref: "usermodel",
      },
    ],
    search: [
      {
        user: {
          type: ObjectId,
          ref: "usermodel",
          text: true,
          require: true,
        },
        createAt: {
          type: Date,
          require: true,
        },
      },
    ],
    details: {
      bio: {
        type: String,
        text: true,
      },
      nickName: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      currentcity: {
        type: String,
      },
      hometown: {
        type: String,
      },
      college: {
        type: String,
      },
      highschool: {
        type: String,
      },
      relationship: {
        type: String,
        enum: [
          "single",
          "in a relationship",
          "it's complecated",
          "Married",
          "Divorced",
        ],
      },
      instagram: {
        type: String,
      },
    },
    savepost: [
      {
        post: {
          type: String,
        },
        saveAt: {
          type: Date,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("usermodel", userModel);
