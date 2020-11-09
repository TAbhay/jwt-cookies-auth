const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"]
  },
  password:{
    type:String,
    required:[true,"can't be blank"]
  },
  active:{
    type:Number,
    default:0
  }
});

const User = mongoose.model("User",userSchema);
module.exports = User;
