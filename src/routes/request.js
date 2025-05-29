const express  = require("express");
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

const requestRouter = express.Router();

//sendConnnectionRequest

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{

      const fromUserId = req.user._id; //get the logged in user id from the request object
      const toUserId = req.params.toUserId; //get the user id from the request params
      const status = req.params.status; //get the status from the request params

      const allowedStaus = ["ignored","interested"]

      if(!allowedStaus.includes(status)){
        return res.status(400).send("Invalid status type.");
      }

      const toUser = await User.findById(toUserId); //find the user by id to whom the request is being sent
      if(!toUser){
        return res.status(404).send("User not found.");
      }

      //check if the connection request already exists
      const exsistingConnnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ]
      })

      if(exsistingConnnectionRequest){
        return res.status(400).json({
          message: `Connection request already exists between users.`
        })}


      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status
      })

      const data = await connectionRequest.save(); //save the connection request to the database

      res.json({
        message: `Connection request sent successfully`,
        data: data
      });

    }catch(err){
      res.status(400).send("Error sending connection request: " + err.message);
    }
  });


  module.exports = requestRouter;