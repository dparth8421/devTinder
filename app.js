const express = require("express");
const app = express();

// app.use("/admin", (req, res) => {
//   //In Route Handler order of execution is important
//   // If you put this route handler first, it will match all requests to /admin and not reach the next one.
//   res.send("Hello Admin!");
// });
app.get("/admin", (req, res) => {
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/admin", (req, res) => {
  res.send("data posted to admin!");
});

app.get("/admin/:id", (req, res) => {
  res.send(`Hello Admin ${req.params.id}`);
});

app.get("/ad?min", (req, res) => {
  // ? means the previous character is optional
  res.send("Hello Admin!");
});
app.get("/ad*min", (req, res) => {
  // * means the previous character can be repeated 0 or more times
  res.send("Hello Admin!");
});
app.get("/ad+min", (req, res) => {
  // + means the previous character can be repeated 1 or more times
  res.send("Hello Admin!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
