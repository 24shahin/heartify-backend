const express = require("express");
const { authMiddleWare } = require("../../middleWears/authMiddleWare");
const { rectPost, getAllReact } = require("../../controllers/rect");

const router = express.Router();
router.put("/react", authMiddleWare, rectPost);
router.get("/getallreact/:id", authMiddleWare, getAllReact);

module.exports = router;
