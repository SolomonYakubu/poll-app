const mongoose = require("mongoose");

const pollSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  categories: [
    {
      name: {
        type: String,
        unique: true,
      },
      voters: Array,
      candidate: [
        {
          name: String,
          votes: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],

  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Polls", pollSchema);
