const express = require("express");
const connectionDB = require("./config/database");
const User = require("./model/user");
const app = express();

app.use(express.json()); //to parse json data by express middleware

app.post("/signUp", async (req, res) => {
  const user = new User(req.body); //create a new user object dynamically
  //req.body is the data we are sending from postman
  try {
    await user.save(); //return a promise thats why we are using await
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

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

//Feed api - get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).send("No users found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching users");
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
