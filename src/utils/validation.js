const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is required");
  }
};

const validateEditProfileData = (req)=>{
const allowedEditFields = ["firstName","lastName","age","about","photoUrl","emailId","gender","skills"];

const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field))

return isEditAllowed
}

module.exports = {
  validateSignUpData,
  validateEditProfileData
};
