const express = require("express");
const connectionDB = require("./config/database");
const User = require("./model/user");
const app = express();

app.post("/signUp", async (req, res) => {
  //Creating a new instance of the User model
  const user = new User({
    firstName: "Parth",
    lastName: "Deshpande",
    emailId: "adb@gmail.com",
    password: "123456",
  });
  try {
    await user.save(); //return a promise thats why we are using await
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
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
