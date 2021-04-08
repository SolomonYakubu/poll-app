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
      name: {
        type: String,
        required: true,
      },
      voters: Array,
      votes: {
        type: Number,
        default: 0,
      },
      candidate: [
        {
          name: String,
          votes: {
            type: Number,
            default: 0,
          },
          voted: {
            type: Boolean,
            default: false,
          },
          voters: [],
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
