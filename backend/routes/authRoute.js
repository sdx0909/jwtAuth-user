// 1 : requiring the newly 'express' server
const express = require("express");
const {
  signin,
  signup,
  getUser,
  logout,
} = require("../controllers/authController");
const jwtAuth = require("../middlewares/jwtAuth");

// 2 : creating the "Router" using "express.Router()"
const authRouter = express.Router();

// 3 : adding the sub-routes for 'authRouter' with contollers
// "/signin" > "/api/auth/signin"  --> signin
authRouter.post("/signin", signin);
// "/signup" > "/api/auth/signup"  --> signup
authRouter.post("/signup", signup);

// '/user' route-contoller with middleware
authRouter.get("/user", jwtAuth, getUser);
// '/logout' route-contoller with middleware
authRouter.get("/logout", jwtAuth, logout);

// 4 : exporting the created 'authRouter'
module.exports = authRouter;
