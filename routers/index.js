const express = require("express");
const router = express.Router();


// all api
const api = require("./api");

const BaseAPI = process.env.BASE_API;


router.use(BaseAPI, api);
module.exports = router;
