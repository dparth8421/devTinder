const express = require("express");
const connectionDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const bycrpt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middlewares/auth");

app.use(express.json()); //to parse json data by express middleware
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
  //const user = new User(req.body); //create a new user object dynamically
  //req.body is the data we are sending from postman
  try {
    validateSignUpData(req); //validate the data

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bycrpt.hash(password, 10); //hash the password

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save(); //return a promise thats why we are using await
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT(); //get the jwt token from user model
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid cridentials");
    }
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;

    // const { token } = cookies;
    // const decodedToken = jwt.verify(token, "DEV@Tinder$123");
    // const { _id } = decodedToken;
    const user = req.user;
    res.send(user);
    // if (!user) {
    //   return res.status(404).send("User not found");
    // } else {
    //   res.status(200).send(user);
    // }
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});

//sendConnnectionRequest

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sendConnectionRequest");

  res.send(user.firstName + " sent connection req!!!!");
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
