const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  role: {
    type: String,
    default: "subscriber",
  },
  resetPasswordLink: {
    data: String,
    default: "",
  },
},{timestamps:true});


// virtual

