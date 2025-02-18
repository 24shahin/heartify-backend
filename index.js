const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routers");
const { connect } = require("./Database/mongoDBConfig");

const corsOptions = {
  origin: 'https://heartify-git-main-24shahins-projects.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
const app = express();
// middle waer
app.use(express.json());
app.use(
  cors(corsOptions)
);
app.options('*', cors(corsOptions));
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
app.listen(port,()=>{
  console.log("server is start")
});
