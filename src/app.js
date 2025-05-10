const express = require("express");
const { adminAuth, userAuth } = require("./Middlewares/auth");
const app = express();

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong"); // In this case error obj is empty so it will go to /getUserData and throw an error
  }
});

app.get("/getUserData", (req, res) => {
  // try {
  throw new Error("Ergergerd");
  res.send("User Data Sent");
  // } catch (err) {
  //     console.log(err);
  //     res.status(500).send("error occured");
  //   }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong111"); //In this case the error object is not empty so it will go to /getUserData and throw an error
  }
}); //always keep error handling middleware at the end

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
