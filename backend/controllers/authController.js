const emailValidator = require("email-validator");
const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
// 1 : creating the controllers:
// '/signup'  -> 'signup' controller
const signup = async (req, res) => {
  // user gives the following info in POST-> REQUEST
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  // validations for name,email,password and confirmPassword
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "all fields are mendatory",
    });
  }

  // checking the email-valid or not
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Email is Not Valid",
    });
  }

  // checking the password and confirmPasssword is same or not.
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password does not match ",
    });
  }

  // all validations are qualified then
  try {
    // passing data to userModel
    const userInfo = userModel(req.body);
    // saving data into mongodb collection via model
    const result = await userInfo.save();

    // return the success-response of data-storing
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    // advanced checking of email-repeating
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};
// '/signin'  -> 'signin' controller
const signin = async (req, res) => {
  const { email, password } = req.body;

  // validations for email and email
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter email and password",
    });
  }

  // checking the user is exists in db or not
  try {
    // passing data to userModel
    const user = await userModel.findOne({ email }).select("+password");
    console.log("User:", user);

    // validating the user and password
    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // generating the user-login/signin token
    const token = user.jwtToken();
    // for securing the password
    user.password = undefined;

    // setting the cookie-options
    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    // actual setting the cookie
    res.cookie("token", token, cookieOption);

    // sending the success-response of setting of cookie
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

// '/user' -> 'getUser' controller with 'jwtAuth' middleware
const getUser = async (req, res) => {
  // checking the user is logged in or not
  // userId of logged-in user --> middelware
  const userId = req.user.id;

  // validating the user-token of logged user
  try {
    // finding single record of given userId
    const user = await userModel.findById(userId);
    // returns the success response
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

// '/logout' -> 'logout' controller with 'jwtAuth' middleware
const logout = async (req, res) => {
  // logout means disabel the cookie
  // so we are setting the cookie with maxAge 0
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    // setting the cookie with null
    res.cookie("token", null, cookieOption);
    // returns the success-response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};
// 2 : exporting the controllers
module.exports = {
  signin,
  signup,
  getUser,
  logout,
};
