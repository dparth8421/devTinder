const express = require("express");
const { userAuth } = require("../Middlewares/auth");

const profileRouter = express.Router();

//profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      // const cookies = req.cookies;
  
      // const { token } = cookies;
      // const decodedToken = jwt.verify(token, "DEV@Tinder$123");
      // const { _id } = decodedToken;
      const user = req.user;
      res.send(user);
      // if (!user) {
      //   return res.status(404).send("User not found");
      // } else {
      //   res.status(200).send(user);
      // }
    } catch (err) {
      res.status(500).send("Error fetching profile: " + err.message);
    }
  });

  module.exports = profileRouter;