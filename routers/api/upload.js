const express = require("express");
const { upolads,imagesList } = require("../../controllers/uploadsController");
const uploadmiddleWares = require("../../middleWears/uploadmiddleWares");
const { authMiddleWare } = require("../../middleWears/authMiddleWare");

const router = express.Router();
router.post("/images", authMiddleWare ,uploadmiddleWares, upolads);
router.post("/getimageslist", authMiddleWare ,imagesList);

module.exports = router;
