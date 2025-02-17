const mongoose = require("mongoose");
const Posts = require("../models/post");
const Reacts = require("../models/reacts");
const User = require("../models/userModel");

exports.rectPost = async (req, res) => {
  try {
    const { postId, react } = req.body;
    const check = await Reacts.findOne({
      postId: postId,
      reactBy: req.user.id,
    });
    if (check === null) {
      const newReacts = new Reacts({
        react: react,
        postId: postId,
        reactBy: req.user.id,
      });
      await newReacts.save();
    } else {
      if (check.react === react) {
        await Reacts.findByIdAndDelete(check._id);
      } else {
        await Reacts.findByIdAndDelete(check._id, { react: react });
      }
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getAllReact = async (req, res) => {
  try {
    const reactArray = await Reacts.find({ postId: req.params.id });
    const check = await Reacts.findOne({
      postId: req.params.id,
      reactBy: req.user.id,
    });
    const newReacts = reactArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});
    const AllReacts = [
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
    ];
    // check post save or not
    const user = await User.findById(req.user.id);
    const isPostSaved = user?.savepost.find(
      (a) => a.post.toString() == req.params.id
    );
    res.json({
      AllReacts,
      check: check?.react,
      total: reactArray.length,
      isPostSaved: isPostSaved ? true : false,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
