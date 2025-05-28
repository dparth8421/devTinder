const express  = require("express");
const { userAuth } = require("../Middlewares/auth");

const requestRouter = express.Router();

//sendConnnectionRequest

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log("sendConnectionRequest");
  
    res.send(user.firstName + " sent connection req!!!!");
  });


  module.exports = requestRouter;