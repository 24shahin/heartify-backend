const userModel = require("../models/userModel");
const Post = require("../models/post");
const {
  emailValidation,
  lengthValidation,
  ValidateUsername,
  jwToken,
} = require("../helpers/validtion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendCode, sendVerificationMail } = require("../helpers/nodemailer");
const resetCode = require("../models/resetCode");
const { codeGenaretore } = require("../helpers/codeGenaretore");
// const { request } = require("express");
exports.userRegistrationController = async (req, res) => {
  try {
    const {
      fname,
      lname,
      username,
      email,
      password,
      profilePicture,
      coverPicture,
      bdate,
      bmonth,
      byear,
      gender,
      verify,
      friends,
      followers,
      following,
      search,
      details,
    } = req.body;

    const alreadyUser = await userModel.findOne({ email: email });
    if (alreadyUser) {
      return res.status(400).json({ message: "already use this email" });
    } else if (lengthValidation(fname, 3, 15)) {
      return res.status(400).json({
        message: "please fname must have at least 3 and max 15 words",
      });
    } else if (lengthValidation(lname, 3, 15)) {
      return res.status(400).json({
        message: "please lname must have at least 3 and max 15 words",
      });
    } else if (!emailValidation(email)) {
      return res.status(400).json({ message: "invalid email" });
    } else if (lengthValidation(password, 8)) {
      return res.status(400).json({ message: "password must have at least 8" });
    }

    let newUsername = fname + lname;
    let finalUsername = await ValidateUsername(newUsername);

    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      const user = new userModel({
        fname: fname,
        lname: lname,
        username: finalUsername,
        email: email,
        password: hash,
        profilePicture: profilePicture,
        coverPicture: coverPicture,
        bdate: bdate,
        bmonth: bmonth,
        byear: byear,
        gender: gender,
        verify: verify,
        friends: friends,
        followers: followers,
        following: following,
        search: search,
        details: details,
      });

      await user.save();
      const emailToken = jwToken({ id: user._id.toString() }, "7d");
      const url = `${process.env.BASE_URL}/active/${emailToken}`;

      // Send verification email
      await sendVerificationMail(user.email, user.fname, url);

      res.send({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        verify: user.verify,
        email: user.email,
        token: emailToken,
        friends: friends,
        followers: followers,
        coverPicture: coverPicture,
        message: "registration successful. Please verify your email",
      });
    });
  } catch (error) {
    res.status(400).json({ message: "can't create user. Try again" });
    return res.status(400).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const emailToken = jwToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      fname: user.fname,
      lname: user.lname,
      verify: user.verify,
      email: user.email,
      token: emailToken,
      friends: user.friends,
      followers: user.followers,
      coverPicture: user.coverPicture,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.reVerfiedEmail = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await userModel.findById(id);
    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "This Email is already verified" });
    }

    const emailToken = jwToken({ id: user._id.toString() }, "7d");
    const url = `${process.env.BASE_URL}/active/${emailToken}`;

    // Send verification email again
    await sendVerificationMail(user.email, user.fname, url);

    return res.status(200).json({
      message: "Email verification link has been sent to your email account",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.resetCode = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await userModel.findOne({ email }).select("-password");
    await resetCode.findOneAndDelete({ user: user._id });

    const code = codeGenaretore(5);
    const newCode = await new resetCode({
      user: user._id,
      code,
    }).save();

    // Send password reset code
    await sendCode(user.email, user.fname, code);

    res.status(200).json({
      message: "Password Reset Code has been sent to your email",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const matchEmail = await userModel.findOne({ email }).select("-password");
    if (!matchEmail) {
      return res.status(404).json({
        message: "Email not Found ",
      });
    }
    return res.status(200).json({
      email: matchEmail.email,
      profilePicture: matchEmail.profilePicture,
      username: matchEmail.username,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.verifiedMail = async (req, res) => {
  try {
    const verified = req.user.id;
    const { token } = req.body;

    // Verify the email token
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (verified !== decoded.id) {
      return res.status(400).json({
        message: "You don't have authorization to complete this operation",
      });
    }

    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "This email is already verified" });
    }

    // Update user verification status
    await userModel.findByIdAndUpdate(decoded.id, { verify: true });

    return res.status(200).json({ message: "Successfully verified" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.verifingCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const users = await userModel.findOne({ email });
    const Decode = await resetCode.findOne({ user: users._id });
    if (Decode.code !== code) {
      return res.status(200).json({ message: "Request code doesn't matched" });
    }
    res.status(200).json({
      message: "Great ! Your code matched",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let { email, password } = req.body;
    let newpassword = await bcrypt.hash(password, 10);
    await userModel.findOneAndUpdate({ email }, { password: newpassword });
    res.status(200).json({
      message: "Your Password has been changed",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findById(req.user.id);
    const userProfile = await userModel
      .findOne({ username })
      .select("-password");
    const friendShip = {
      friend: false,
      request: false,
      following: false,
      requestReceived: false,
    };
    if (!userProfile) {
      return res.json({ message: "User not Found" });
    }
    if (
      user.friends.includes(userProfile._id) &&
      userProfile.friends.includes(user._id)
    ) {
      friendShip.friend = true;
    }
    if (user.following.includes(userProfile._id)) {
      friendShip.following = true;
    }
    if (userProfile.request.includes(user._id)) {
      friendShip.request = true;
    }
    if (user.request.includes(userProfile._id)) {
      friendShip.requestReceived = true;
    }
    const posts = await Post.find({ user: userProfile._id })
      .populate("user")
      .populate("comments.commentedBy", "fname lname username profilePicture")
      .sort({ createdAt: -1 });
    await userProfile.populate(
      "friends",
      "fname lname username profilePicture"
    );
    res.json({ ...userProfile.toObject(), posts, friendShip });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.uploadProfilepic = async (req, res) => {
  try {
    const { url } = req.body;
    await userModel.findByIdAndUpdate(req.user.id, { profilePicture: url });
    res.json(url);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.uploadCoverepic = async (req, res) => {
  try {
    const { url } = req.body;
    await userModel.findByIdAndUpdate(req.user.id, { coverPicture: url });
    res.json(url);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.uploadUserDetails = async (req, res) => {
  try {
    const { infos } = req.body;
    const update = await userModel.findByIdAndUpdate(
      req.user.id,
      { details: infos },
      { new: true }
    );
    res.send(update.details);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await userModel.findById(req.user.id);
      const receiver = await userModel.findById(req.params.id);
      if (
        !receiver.friends.includes(sender._id) &&
        !receiver.request.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { request: sender._id, createAt: new Date() },
        });
        await receiver.updateOne({ $push: { followers: sender._id } });
        await sender.updateOne({ $push: { following: receiver._id } });
        res.status(200).json({ message: "Your friend request has been sent" });
      } else {
        return res.json({
          message: "You can't sent frind request to this user",
        });
      }
    } else {
      return res.json({ message: "You can't sent frind request yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.cancleRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await userModel.findById(req.user.id);
      const receiver = await userModel.findById(req.params.id);
      if (
        !receiver.friends.includes(sender._id) &&
        receiver.request.includes(sender._id)
      ) {
        await receiver.updateOne({ $pull: { request: sender._id } });
        await receiver.updateOne({ $pull: { followers: sender._id } });
        await sender.updateOne({ $pull: { following: receiver._id } });
        res.status(200).json({ message: "friend request has been canceled" });
      } else {
        return res.json({ message: "Already Canceled" });
      }
    } else {
      return res.json({ message: "You can't cancle frind request yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await userModel.findById(req.user.id);
      const sender = await userModel.findById(req.params.id);
      if (receiver.request.includes(sender._id)) {
        await userModel.findByIdAndUpdate(
          receiver._id,
          { $push: { friends: sender._id, following: sender._id } },
          { new: true }
        );
        await userModel.findByIdAndUpdate(
          sender._id,
          { $push: { friends: receiver._id, followers: receiver._id } },
          { new: true }
        );
        await receiver.updateOne({ $pull: { request: sender._id } });
        res.status(200).json({ message: "friend request has been accepted" });
      } else {
        return res.json({ message: "Already friends" });
      }
    } else {
      return res.json({ message: "You can't accept frind request yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.Follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await userModel.findById(req.user.id);
      const receiver = await userModel.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({ $push: { followers: sender._id } });
        await sender.updateOne({ $push: { following: receiver._id } });
        res.status(200).json({ message: "Successfully follow" });
      } else {
        return res.json({ message: "Already followed" });
      }
    } else {
      return res.json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.UnFollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await userModel.findById(req.user.id);
      const receiver = await userModel.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({ $pull: { followers: sender._id } });
        await sender.updateOne({ $pull: { following: receiver._id } });
        res.status(200).json({ message: "Successfully Unfollow" });
      } else {
        return res.json({ message: "Already Unfollowed" });
      }
    } else {
      return res.json({ message: "You can't Unfollow yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.UnFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await userModel.findById(req.user.id);
      const receiver = await userModel.findById(req.params.id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await userModel.findByIdAndUpdate(
          receiver._id,
          {
            $pull: {
              friends: sender._id,
              followers: sender._id,
              following: sender._id,
            },
          },
          { new: true }
        );
        await userModel.findByIdAndUpdate(
          sender._id,
          {
            $pull: {
              friends: receiver._id,
              followers: receiver._id,
              following: receiver._id,
            },
          },
          { new: true }
        );
        res.status(200).json({ message: "Successfully Unfriend" });
      } else {
        return res.json({ message: "Already Unfriend" });
      }
    } else {
      return res.json({ message: "You can't Unfriend yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await userModel.findById(req.user.id);
      const sender = await userModel.findById(req.params.id);
      if (receiver.request.includes(sender._id)) {
        await userModel.findByIdAndUpdate(
          receiver._id,
          { $pull: { request: sender._id, followers: sender._id } },
          { new: true }
        );

        await sender.updateOne({ $pull: { following: receiver._id } });
        res.status(200).json({ message: "Friend Request Delete" });
      } else {
        return res.json({ message: "Already Deleted" });
      }
    } else {
      return res.json({ message: "You can't friend request delete yourself" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const search = await userModel
      .find({ $text: { $search: searchTerm } })
      .select("fname lname username profilePicture");
    res.json(search);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.addSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createAt: new Date(),
    };
    const user = await userModel.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() == searchUser);

    if (check) {
      await userModel.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: {
            "search.$.createAt": new Date(),
          },
        }
      );
    } else {
      await userModel.findByIdAndUpdate(req.user.id, {
        $push: { search },
      });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const getSearch = await userModel
      .findById(req.user.id)
      .select("search")
      .populate("search.user", "fname lname username profilePicture");
    res.json(getSearch.search);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.removeSearchHistory = async (req, res) => {
  try {
    const { removeSearchUser } = req.body;
    const result = await userModel.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: {
          search: {
            user: removeSearchUser,
          },
        },
      }
    );
    if (result.modifiedCount > 0) {
      res.json({ message: "ok" });
    } else {
      return res.status(404).json({ message: "not remove now" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.getAllFriends = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("friends request")
      .populate("friends", "fname lname username profilePicture")
      .populate("request", "fname lname username profilePicture");
    const sentrequest = await userModel
      .find({ request: req.user.id })
      .select("fname lname username profilePicture");
    res.json({
      friends: user.friends,
      request: user.request,
      sentrequest,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// work on leter (nicher gula pore kora hobe)

// exports.blockUser = async (req, res) => {
//   try {
//     if (req.user.id !== req.params.id) {
//       const blocker = await userModel.findById(req.user.id);
//       const blocked = await userModel.findById(req.params.id);

//       if (!blocker.blockedUsers.includes(blocked._id)) {
//         // Add the blocked user's ID to the blocker's `blockedUsers` list
//         await blocker.updateOne({ $push: { blockedUsers: blocked._id } });

//         // Optional: Remove any pending friend requests, follows, etc.
//         await blocked.updateOne({ $pull: { followers: blocker._id, request: blocker._id } });
//         await blocker.updateOne({ $pull: { following: blocked._id, request: blocked._id } });

//         res.status(200).json({ message: "User successfully blocked" });
//       } else {
//         return res.json({ message: "User is already blocked" });
//       }
//     } else {
//       return res.json({ message: "You cannot block yourself" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// exports.unblockUser = async (req, res) => {
//   try {
//     if (req.user.id !== req.params.id) {
//       const blocker = await userModel.findById(req.user.id);
//       const blocked = await userModel.findById(req.params.id);

//       if (blocker.blockedUsers.includes(blocked._id)) {
//         // Remove the blocked user's ID from the blocker's `blockedUsers` list
//         await blocker.updateOne({ $pull: { blockedUsers: blocked._id } });
//         res.status(200).json({ message: "User successfully unblocked" });
//       } else {
//         return res.json({ message: "User is not blocked" });
//       }
//     } else {
//       return res.json({ message: "You cannot unblock yourself" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
