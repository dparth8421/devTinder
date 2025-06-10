const express = require("express");
const connectionDB = require("./config/database");
const User = require("./model/user");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}))

app.use(express.json()); //to parse json data by express middleware
app.use(cookieParser());




app.use("/",authRouter, profileRouter,requestRouter, userRouter);


//User
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
});

//find user by id
app.get("/userId", async (req, res) => {
  const userId = req.body._id;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    {
      if (!user) {
        return res.status(404).send("User not found");
      } else {
        res.status(200).send(user);
      }
    }
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
});



//delete user
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

//update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const allowedUpdates = ["photoUrl", "about", "skills", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid update fields");
    }
    if (data?.skills.length > 5) {
      throw new Error("Skills should not be greater than 5");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
    }
  } catch (err) {
    res.status(500).send("Error updating user" + err.message);
  }
});

connectionDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err.message);
  });

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
