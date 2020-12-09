const mongoose = require("mongoose");
const pollSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  categories: {
    type: Array,
  },

  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Polls", pollSchema);
