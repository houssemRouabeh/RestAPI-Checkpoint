const mongoose = require("mongoose");

const dbCOnnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database conected ");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = dbCOnnect;
