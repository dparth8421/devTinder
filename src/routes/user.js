const express = require("express");
const User = require("../model/user");
const ConnectionRequestModel = require("../model/connectionRequest");
const { userAuth } = require("../Middlewares/auth");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName email age photoUrl about skills";

//get all recieved request
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");

    res.json({
      message: "Recieved connection requests fetched successfully.",
      data: connectionRequest,
      success: true,
    });
  } catch (err) {
    res
      .status(400)
      .send("Error fetching recieved connection requests: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) =>
      row.fromUserId._id.equals(loggedInUser._id)
        ? row.toUserId
        : row.fromUserId
    );

    res.json({
      message: "My Connecitons!",
      data: data,
      success: true,
    });
  } catch (err) {
    res.status(400).send("Error fetching connections: " + err.message);
  }
});

//feed
//Feed api - get all users
userRouter.get("/feed",userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //get the logged in user from the request object
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; //pagination parameters
    limit = limit > 50 ? 50 : limit; //limit the number of documents returned to 100
    const skip = (page - 1) * limit; //calculate the number of documents to skip

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId "); //get all the connection requests where the logged in user is either the fromUser or toUser

    const hiddenUserIds = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserIds.add(req.fromUserId.toString());
      hiddenUserIds.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserIds) } },
        { _id: { $ne: loggedInUser._id } },
      ], //exclude users who are already connected or have sent a request
    })
      .select(USER_SAFE_DATA) //select only the safe data to return
      .skip(skip) //apply pagination
      .limit(limit); //limit the number of documents returned

    res.json({
      message: "Feed fetched successfully",
      data: users,
    });
  }catch (err) {
    res.status(500).send("Error fetching users:::" + err.message);
  }
});

module.exports = userRouter;