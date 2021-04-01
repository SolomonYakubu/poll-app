const mongoose = require("mongoose");

const pollSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  voters: Array,
  categories: [
    {
      name: {
        type: String,
        unique: true,
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
