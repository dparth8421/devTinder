const express = require("express");
const app = express();

app.use("/admin", (req, res) => {
  //In Route Handler order of execution is important
  // If you put this route handler first, it will match all requests to /admin and not reach the next one.
  res.send("Hello Admin!");
});
app.use("/admin/2", (req, res) => {
  res.send("Hello Hello Hello!");
});
app.use("/dashboard", (req, res) => {
  res.send("Hello dashboard!");
});
app.use("/dashboard/2", (req, res) => {
  res.send("Hello from server!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
