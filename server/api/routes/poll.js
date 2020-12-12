require("dotenv").config();

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/userAuth");
const verifyAdminToken = require("../auth/adminAuth");
const Polls = require("../models/polls");

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
  if (await Polls.findOne({ name: req.body.name })) {
    return res.status(403).json({ message: "Poll already exist" });
  }
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
//Register a new category
router.post("/category", verifyAdminToken, async (req, res) => {
  const name = req.body.name;
  const pollName = req.body.pollName;
  try {
    const poll = await Polls.findOne({ name: pollName });
    poll.categories.push({ name });
    poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Register a new candidate
router.post("/candidate/:category_id", verifyAdminToken, async (req, res) => {
  const name = req.body.name;
  const pollName = req.body.pollName;
  const category = req.body.category;
  const category_id = req.params.category_id;
  const data = {
    name,
  };

  try {
    // if (await Candidate.findOne({ name })) {
    //   return res.status(403).json({ message: "Candidate already exist" });
    // }
    const poll = await Polls.findOne({ name: pollName });
    poll.categories.id(category_id).candidate.push(data);

    //const newCandidate = await candidate.save();
    const newCandidate = await poll.save();
    // if (!poll.categories.includes(category)) {
    //   poll.categories.push(category);
    //   poll.save();
    // }
    res.status(201).json(newCandidate);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//vote a candidate
router.post(
  "/vote/category/:category_id/candidate/:candidate_id",
  verifyToken,
  async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const pollName = req.body.pollName;
    const mobile_id = req.data.mobile_id;
    const candidate_id = req.params.candidate_id;
    const category_id = req.params.category_id;
    console.log(candidate_id, candidate_id);
    try {
      if (!(await Polls.findOne({ name: pollName }))) {
        return res.status(404).json({ message: "Poll not found" });
      }

      // const user = await User.findOne({
      //   mobile_id,
      // });
      // if (
      //   user.poll.categoryVoted.includes(category) &&
      //   user.poll.name === pollName
      // ) {
      //   return res
      //     .status(401)
      //     .json({ message: "You have already voted in this category" });
      // }
      // const candidate = await Candidate.findOne({
      //   name: name,
      // });
      const poll = await Polls.findOne({ name: pollName });

      if (await poll.categories.id(category_id).voters.includes(mobile_id)) {
        return res
          .status(403)
          .json({ message: "You have already voted in this category" });
      }
      poll.categories.id(category_id).candidate.id(candidate_id).votes++;
      poll.categories.id(category_id).voters.push(mobile_id);
      poll.save();

      // candidate.votes++;
      // candidate.save();

      // user.candidateSelected.push(name);
      // user.poll.categoryVoted.push(category);
      // user.poll.name = pollName;
      // user.save();
      // const test = candidate.candidate.filter(
      //   (item) => item.name === "Yakubu Solomon"
      // ).votes++;
      // test.save();
      res.json(poll);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);

module.exports = router;
