import mongoose from "mongoose";


// const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

employeeId: {
  type: String,
  required: true,
  unique: true,
  uppercase: true,
  trim: true,
  match: [
    /^[A-Z]{4}\d{12}$/,
    "Employee ID must contain 4 letters followed by 12 numbers"
  ]
},

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "team", "candidate"],
    default: "candidate"
  },
  mobile:{
    type:String,
    required:true
  },
  teamNumber: {
  type: String,
}

}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);


const User = mongoose.model("User", userSchema);
export default User;
