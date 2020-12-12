const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  mobile_id: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("User", userSchema);
