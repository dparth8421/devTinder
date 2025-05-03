const express = require("express");
const app = express();

app.use("/admin", (req, res) => {
  res.send("Hello Admin!");
});
app.use("/dasshboard", (req, res) => {
  res.send("Hello dashboard!");
});
app.use("/test", (req, res) => {
  res.send("Hello frpm server!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
