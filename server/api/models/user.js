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
  candidateSelected: {
    type: Array,
  },
  categoryVoted: {
    type: Array,
  },
});
module.exports = mongoose.model("User", userSchema);
