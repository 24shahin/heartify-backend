const express = require("express");
const router = express.Router();
const api = require("./auth.js");
const post = require("./post.js");
const upload = require("./upload.js");
const reacts = require("./react.js");
router.use("/auth", api);
router.use("/post", post);
router.use("/upload", upload);
router.use("/reacts", reacts);
module.exports = router;
