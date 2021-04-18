const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  voters: Array,
  votes: {
    type: Number,
    default: 0,
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidates",
    },
  ],
});

module.exports = mongoose.model("Categories", categorySchema);
