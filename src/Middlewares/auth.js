const jwt = require("jsonwebtoken");
const user = require("../model/user");
const User = require("../model/user");

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decodedOBbj = await jwt.verify(token, "DEV@Tinder$123");

    const { _id } = decodedOBbj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    res.status(400).send("error" + err.message);
  }
};

module.exports = { adminAuth, userAuth };
