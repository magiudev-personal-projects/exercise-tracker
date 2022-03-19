const {connect} = require("mongoose");
const {dbUrl} = require("./config");

const connectDb = async () => {
  await connect(dbUrl);
  console.log("Database successfully connected");
}

module.exports = connectDb;