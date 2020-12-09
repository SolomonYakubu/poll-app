const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  votes: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  pollName: {
    required: true,
    type: String,
  },
});
module.exports = mongoose.model("Candidate", candidateSchema);
