const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required!!"],
    unique: true,
    validate: function (value) {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    required: [true, "Password is required!!"],
    minLength: [8, "The password must contain at least 8 characters"],
    select: false, //Show password or not in response,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

//Password hashing before save
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
