const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const authRouter = require("./auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data format");
    } //validate the data

    const loggedInUser = req.user;

    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); //update the user object with the new data
    console.log(loggedInUser);

    await loggedInUser.save(); //save the updated user object to the database
    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error updating profile: " + err.message);
  }
});

//password
// profileRouter.patch("/profile/password", async(req, res) => {
//   try{
  
//   }
// })

module.exports = profileRouter;