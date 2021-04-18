const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },

  voters: [],
});

module.exports = mongoose.model("Candidates", candidateSchema);
