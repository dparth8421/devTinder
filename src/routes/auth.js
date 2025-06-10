const express =require("express");
const User = require("../model/user");
const { validateSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bycrpt = require("bcrypt");

const authRouter = express.Router();




authRouter.post("/signUp", async (req, res) => {
    //const user = new User(req.body); //create a new user object dynamically
    //req.body is the data we are sending from postman
    try {
      validateSignUpData(req); //validate the data
  
      const { firstName, lastName, emailId, password } = req.body;
      const passwordHash = await bycrpt.hash(password, 10); //hash the password
  
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      await user.save(); //return a promise thats why we are using await
      res.send("User created successfully");
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  });
  
  authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT(); //get the jwt token from user model
        res.cookie("token",token)
        res.status(200).send(user);
      } else {
        res.status(401).send("Invalid cridentials");
      }
    } catch (err) {
      res.status(500).send("Error logging in: " + err.message);
    }
  });

  authRouter.post("/logout", async (req, res) => {
    try {
      res.cookie("token",null,{
        expires:new Date(Date.now())
      }); //clear the cookie
      res.status(200).send("Logout successful");
    } catch (err) {
      res.status(500).send("Error logging out: " + err.message);
    }
  });

  module.exports = authRouter;