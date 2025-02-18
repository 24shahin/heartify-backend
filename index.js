const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routers");
const { connect } = require("./Database/mongoDBConfig");


const app = express();
// middle waer
app.use(express.json());
app.use(
  cors({
    origin: "https://heartify-git-main-24shahins-projects.vercel.app",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// database connect
connect();
// all api

app.use(router);

const port = 8000;
app.listen(port);
