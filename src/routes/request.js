const express  = require("express");
const { userAuth } = require("../Middlewares/auth");
const User = require("../model/user");
const ConnectionRequestModel = require("../model/connectionRequest");

const requestRouter = express.Router();

//sendConnnectionRequest

const USER_SAFE_DATA = "firstName lastName email age photoUrl about skills";

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


requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //Validate Status
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status or Status not allowed",
          success: false,
        });
      }

      //validating the request
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "request not found ",
          success: false,
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection request " + status,
        data,
        success: true,
      });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

//get all recieved request
requestRouter.get("/user/requests/recieved", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId","firstName lastName")

    res.json({
      message: "Recieved connection requests fetched successfully.",
      data: connectionRequest,
      success: true
    })
  }catch(err){
    res.status(400).send("Error fetching recieved connection requests: " + err.message);
  }
})

requestRouter.get("/user/connections",userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or:[
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}]
    }).populate("fromUserId", USER_SAFE_DATA ).populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) =>row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId
    )

    res.json({
      message: "My Connecitons!",
      data: data,
      success: true
    })

  }catch(err){
res.status(400).send("Error fetching connections: " + err.message);
  }
})




module.exports = requestRouter;