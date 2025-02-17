const Post = require("../models/post");
const User = require("../models/userModel");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate(
      "user",
      "username profilePicture  fname  lname  coverPicture gender"
    );
    res.json(post);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate(
          "user",
          "username profilePicture  fname  lname  coverPicture gender"
        )
        .populate("comments.commentedBy", "fname lname username profilePicture")
        .sort({ createdAt: -1 });
    });

    const followingPost = await (await Promise.all(promises)).flat();
    const UserPost = await Post.find({ user: req.user.id })
      .populate(
        "user",
        "username , profilePicture , fname , lname , coverPicture, gender"
      )
      .populate("comments.commentedBy", "fname lname username profilePicture")
      .sort({ createdAt: -1 });
    followingPost.push(...[...UserPost]);
    followingPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.json(followingPost);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.postComments = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    const newComment = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentedBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentedBy", "fname lname username profilePicture");

    res.json(newComment.comments);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savepost.find((a) => a.post.toString() == postId);
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savepost: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savepost: {
            post: postId,
            saveAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.DeletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ response: "done" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
