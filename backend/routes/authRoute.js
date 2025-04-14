// 1 : requiring the newly 'express' server
const express = require("express");
const { signin, signup } = require("../controllers/authController");

// 2 : creating the "Router" using "express.Router()"
const authRouter = express.Router();

// 3 : adding the sub-routes for 'authRouter' with contollers
// "/signin" > "/api/auth/signin"  --> signin
authRouter.post("/signin", signin);
// "/signup" > "/api/auth/signup"  --> signup]
authRouter.post("/signup", signup);

// 4 : exporting the created 'authRouter'
module.exports = authRouter;
