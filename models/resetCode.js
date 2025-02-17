const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const resetCode = new mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  user: {
    type: ObjectId,
    ref: "userModel",
    require: true,
  },
});
module.exports = mongoose.model("resetCode", resetCode);
