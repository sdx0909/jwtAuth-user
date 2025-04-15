const { config } = require("dotenv");
config();

// 1 : requiring the "mongoose"
const mongoose = require("mongoose");

// 2 : declaring the MONGODB_URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/auth_db";

// 3 : creating the db connection controller
const databaseConnect = () => {
  mongoose
    .connect(MONGODB_URI)
    .then((res) => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// 4 : exporting the connection controller
module.exports = databaseConnect;
