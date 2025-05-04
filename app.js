const express = require("express");
const { adminAuth, userAuth } = require("./Middlewares/auth");
const app = express();

app.use("/admin", adminAuth);
app.get("/User", userAuth, (req, res) => {
  res.send("User Data Sent");
});
app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent successfully!");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted User Successfully!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
