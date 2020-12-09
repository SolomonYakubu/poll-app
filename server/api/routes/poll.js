require("dotenv").config();

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/userAuth");
const verifyAdminToken = require("../auth/adminAuth");
const Polls = require("../models/polls");
const Candidate = require("../models/candidate");
const User = require("../models/user");

// get all Polls
router.get("/", async (req, res) => {
  try {
    const polls = await Polls.find();
    if (polls == 0) {
      return res.status(404).json({ message: "No polls found" });
    }
    res.json(polls);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Create a new Poll
router.post("/", verifyAdminToken, async (req, res) => {
  const data = {
    name: req.body.name,
    deadline: req.body.deadline,
  };
  const poll = new Polls(data);
  try {
    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Register a new candidate
router.post("/candidate", verifyAdminToken, async (req, res) => {
  const name = req.body.name;
  const pollName = req.body.pollName;
  const category = req.body.category;
  const data = {
    name,
    pollName,
    category,
  };
  const candidate = new Candidate(data);
  try {
    if (await Candidate.findOne({ name })) {
      return res.status(403).json({ message: "Candidate already exist" });
    }
    const poll = await Polls.findOne({ name: pollName });

    const newCandidate = await candidate.save();
    if (!poll.categories.includes(category)) {
      poll.categories.push(category);
      poll.save();
    }
    res.status(201).json(newCandidate);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//vote a candidate
router.post("/vote", verifyToken, async (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const pollName = req.body.pollName;
  const mobile_id = req.data.mobile_id;
  try {
    if (!(await Polls.findOne({ name: pollName }))) {
      return res.status(404).json({ message: "Poll not found" });
    }
    const user = await User.findOne({
      mobile_id,
    });
    if (user.categoryVoted.includes(category)) {
      return res
        .status(401)
        .json({ message: "You have already voted in this category" });
    }
    const candidate = await Candidate.findOne({
      name: name,
    });
    candidate.votes++;
    candidate.save();

    user.candidateSelected.push(name);
    user.categoryVoted.push(category);
    user.save();
    res.json(candidate);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
