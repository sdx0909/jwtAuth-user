// STEPS TO CREATE A MODEL
// 1 : REQUIRING THE 'mongoose' module from 'mongoose'
// 2 : DECLARING THE 'Schema' FROM 'mongoose'.
// 3 : DEFINING THE 'Schema' for 'user' -> userSchema with validations
// 4 : ATTACHING THE 'pre()' middlewares (optional)
// 5 : ATTACHNG THE CUSTOM 'methods' FOR TOKEN GENERATIONS o(optional)
// 6 : CREATING THE USER "model" from "userSchema" WITH COLLECTION NAME.
// 7 : EXPORTING THE USER "model".

const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User-Name is required"],
      minLength: [5, "Enter at-least 5 characters name"],
      maxLength: [50, "Name length at-most 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//  custom-methods for UESERSCHEMA --> JWT-TOKEN GENERATION
userSchema.methods = {
  jwtToken() {
    // in this token storing id and email
    // i.e storing the "payload"
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: "24h",
    });
  },
};

// custom-middelware for securing the user-password
// it triggering whenever we save the data of user.
userSchema.pre("save", async function (next) {
  // if password not changed
  if (!this.isModified("password")) {
    return next();
  }
  // password ecrypted in 10 character and stores in db
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// creating the userModel
const userModel = mongoose.model("user", userSchema);

// exporting the userModel
module.exports = userModel;
