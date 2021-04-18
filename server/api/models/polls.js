const mongoose = require("mongoose");

const pollSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  voters: {
    type: Array,
  },
  votes: {
    type: Number,
    default: 0,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Polls", pollSchema);
