const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      // required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

// methods
userSchema.methods.encryptPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(13, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(password, salt, (err2, hashed) => {
        if (err2) return reject(err2);

        resolve(hashed);
      });
    });
  });
};

const ffetch = (r = false) => {
  return new Promise((resolve, reject) => {
    if (r) return reject("Some value");
    resolve("Some other value in resolve");
  });
};

ffetch()
  .then((res) => {
    console.log("SUCCESS", res);
  })
  .catch((err) => {
    console.log("ERROR", err);
  });

(async () => {
  try {
    const res = await ffetch(1);
    console.log("ASYNC SUCCESS", res);
  } catch (error) {
    console.log("ASYNC ERROR", error);
  }
})();

userSchema.methods.authenticate = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.hashed_password, (err, matched) => {
      if (err) return reject(err);

      resolve(matched);
    });
  });
};

module.exports = mongoose.model("User", userSchema);
