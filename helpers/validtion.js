const userModel = require("../models/userModel");
var jwt = require("jsonwebtoken");

exports.emailValidation = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.lengthValidation = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return true;
  } else {
    return false;
  }
};

exports.ValidateUsername = async (username) => {
  let isTrue = false;

  do {
    let tmeuser = await userModel.findOne({ username });
    if (tmeuser) {
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      isTrue = true;
    } else {
      isTrue = false;
    }
  } while (isTrue);
  return username;
};

exports.jwToken = (user, expire) => {
  return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: expire });
};
