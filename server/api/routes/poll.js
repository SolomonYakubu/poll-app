require("dotenv").config();

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/userAuth");
const verifyAdminToken = require("../auth/adminAuth");
const Polls = require("../models/polls");

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
//get poll by name
router.get("/:name", verifyToken, async (req, res) => {
  const pollName = req.params.name;
  try {
    const poll = await Polls.findOne({ name: pollName });
    if (!poll) {
      res.sendStatus(404);
    }
    res.json(poll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Create a new Poll
router.post("/", verifyAdminToken, async (req, res) => {
  if (await Polls.findOne({ name: req.body.name })) {
    return res.status(406).json({ message: "Poll already exist" });
  }
  if (req.body.name == "") {
    return res.status(400).json({ message: "Bad request" });
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

    const nameArr = poll.categories.map((item) => item.name);
    const isDuplicate = nameArr.includes(name) ? true : false;
    console.log(isDuplicate);
    if (isDuplicate) {
      return res.status(406).json({ message: "category already exist" });
    }
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

  const category_id = req.params.category_id;
  const data = {
    name,
  };

  try {
    const poll = await Polls.findOne({ name: pollName });
    const nameArr = poll.categories
      .filter((item) => item._id == category_id)[0]
      .candidate.map((item) => item.name);

    console.log(nameArr);
    const isDuplicate = nameArr.includes(name) ? true : false;
    console.log(isDuplicate);
    if (isDuplicate) {
      return res.status(406).json({ message: "Candidate already exist" });
    }
    poll.categories.id(category_id).candidate.push(data);

    const newCandidate = await poll.save();

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
    const pollName = req.body.pollName;
    const mobile_id = req.data.mobile_id;
    const candidate_id = req.params.candidate_id;
    const category_id = req.params.category_id;
    console.log(candidate_id, candidate_id);
    try {
      if (!(await Polls.findOne({ name: pollName }))) {
        return res.status(404).json({ message: "Poll not found" });
      }

      const poll = await Polls.findOne({ name: pollName });

      if (await poll.categories.id(category_id).voters.includes(mobile_id)) {
        return res
          .status(403)
          .json({ message: "You have already voted in this category" });
      }
      poll.categories.id(category_id).candidate.id(candidate_id).votes++;
      poll.categories.id(category_id).voters.push(mobile_id);
      poll.categories
        .id(category_id)
        .candidate.id(candidate_id)
        .voters.push(mobile_id);
      poll.save();

      res.json(poll);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);
//delete a candidate
router.delete(
  "/category/:category_id/candidate/:candidate_id",
  verifyAdminToken,
  async (req, res) => {
    const category_id = req.params.category_id;
    const candidate_id = req.params.candidate_id;
    const pollName = req.body.pollName;

    try {
      const poll = await Polls.findOne({ name: pollName });

      // const filter = poll.categories
      //   .id(category_id) //eslint-disable-next-line
      //   .candidate.filter((item) => item._id != candidate_id);
      // if (filter == null) {
      //   return res.sendStatus(404);
      // }
      // poll.categories.id(category_id).candidate = filter;
      poll.categories.id(category_id).candidate.id(candidate_id).remove();
      poll.save();
      console.log(poll);
      res.json(poll);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);
//delete a category
router.delete("/category/:category_id", verifyAdminToken, async (req, res) => {
  const category_id = req.params.category_id;
  const pollName = req.body.pollName;
  try {
    const poll = await Polls.findOne({ name: pollName });
    poll.categories.id(category_id).remove();
    poll.save();
    res.json(poll);
    console.log(poll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
