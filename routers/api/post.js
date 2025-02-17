const express = require("express");
const {
  createPost,
  getAllPosts,
  postComments,
  savePost,
  DeletePost,
} = require("../../controllers/postController");
const { authMiddleWare } = require("../../middleWears/authMiddleWare");

const router = express.Router();
router.post("/createpost", authMiddleWare, createPost);
router.get("/getallposts", authMiddleWare, getAllPosts);
router.put("/comment", authMiddleWare, postComments);
router.put("/savepost/:id", authMiddleWare, savePost);
router.delete("/removepost/:id", authMiddleWare, DeletePost);

module.exports = router;
