const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
  username: String
})

const User = new model("users", UserSchema);

module.exports = User;