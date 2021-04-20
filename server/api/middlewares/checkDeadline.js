const Polls = require("../models/polls");

const checkDeadline = async (req, res, next) => {
  const pollId = req.params.id;
  try {
    const poll = await Polls.findById(pollId);
    const deadline = poll.deadline;
    if (new Date(deadline) < new Date()) {
      return res.status(405).json({ message: "poll Expired" });
    }
    next();
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = checkDeadline;
