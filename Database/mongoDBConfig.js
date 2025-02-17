
const mongoose = require("mongoose");
const databaseURL = process.env.MONGODB_DATABASE_API;

exports.connect = ()=>{
    mongoose.connect(databaseURL).then(() => console.log("DataBase connected"));

}