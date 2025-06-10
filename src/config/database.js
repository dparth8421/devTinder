const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://parthd8421:LMzaan2mlLsJLQmv@devtinder.toj7tss.mongodb.net/devTinder"
  );
};

module.exports = connectionDB;