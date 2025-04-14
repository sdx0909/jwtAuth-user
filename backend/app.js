// 1: requiring the actual express server
const express = require("express");

// configuring for '.env' file-access in index.js
const { config } = require("dotenv");
// execute it :
config();

// 2: creating the express server
const app = express();

// 3 : Requests will reach this route after
//     passing through the middleware
app.use("/", (req, res) => {
  res.status(200).json({
    data: "jwt Authentication server",
  });
});

// 4 : exporting the 'app' module to accessible everyone
module.exports = app;
