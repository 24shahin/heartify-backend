const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Reacts = new Schema({
  react: {
    type: String,
    enum: ["like", "love", "haha", "angry", "wow", "sad"],
    require: true,
  },
  postId: {
    type: ObjectId,
    ref: "posts",
  },
  reactBy: {
    type: ObjectId,
    ref: "usermodel",
  },
});

module.exports = mongoose.model("react", Reacts);
