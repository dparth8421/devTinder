const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyzq";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
