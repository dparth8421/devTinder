const express = require("express");
const app = express();

// app.use("/admin",[rh1,rh2],rh3,rh4) you can use an array of middleware functions
app.use(
  "/admin",
  (req, res, next) => {
    console.log("Admin Middleware");
    next();
    //res.send("Admin Route");
  },
  (req, res, next) => {
    console.log("Admin Middleware 2");
    next();
  },
  [
    (req, res, next) => {
      console.log("Admin Middleware 3");
      next();
    },
    (req, res) => {
      console.log("Admin Middleware 4");
      res.send("Admin Route 4");
    },
  ]
);

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
