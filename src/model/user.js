const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      MinLength: 3,
      MaxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.transparentpng.com%2Fcats%2Fuser-2132.html&psig=AOvVaw2mbqrQMNuSsiULnBF9rY7G&ust=1747733007863000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjWnoObr40DFQAAAAAdAAAAABAE",
    },
    about: {
      type: String,
      default: "default about for a user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
