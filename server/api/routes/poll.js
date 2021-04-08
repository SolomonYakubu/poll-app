require("dotenv").config();

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/userAuth");
const verifyAdminToken = require("../auth/adminAuth");
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
// get all Polls
router.get("/", async (req, res) => {
  try {
    const polls = await Polls.find();
    if (polls == 0) {
      return res.status(404).json({ message: "No polls found" });
    }
    const data = polls.map((item) => ({
      name: item.name,
      _id: item._id,
      deadline: item.deadline,
    }));
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
});
//get poll by id
router.get("/:id", [verifyToken, checkDeadline], async (req, res) => {
  const pollId = req.params.id;
  const mobile_id = req.data.mobile_id;
  try {
    const poll = await Polls.findById(pollId);
    if (!poll) {
      res.sendStatus(404);
    }
    const data = {
      name: poll.name,
      _id: poll._id,
      voted: poll.voters.includes(mobile_id) ? true : false,
      categories: poll.categories.map((item) => ({
        name: item.name,
        _id: item._id,
        voted: item.voters.includes(mobile_id) ? true : false,
        candidate: item.candidate.map((obj) => ({
          name: obj.name,
          _id: obj._id,
          voted: obj.voters.includes(mobile_id) ? true : false,
        })),
      })),
    };
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Create a new Poll
router.post("/", verifyAdminToken, async (req, res) => {
  // if (await Polls.findOne({ name: req.body.name })) {
  //   return res.status(406).json({ message: "Poll already exist" });
  // }
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
  const pollId = req.body.pollId;

  if (req.body.name == "") {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const poll = await Polls.findById(pollId);

    const nameArr = poll.categories.map((item) => item.name);
    const isDuplicate = nameArr.includes(name) ? true : false;

    if (isDuplicate) {
      return res.status(406).json({ message: "category already exist" });
    }
    poll.categories.push({ name });
    const newPoll = await poll.save();
    const newCategory = {
      name: newPoll.name,
      _id: newPoll._id,

      categories: newPoll.categories.map((item) => ({
        name: item.name,
        _id: item._id,

        candidate: item.candidate.map((obj) => ({
          name: obj.name,
          _id: obj._id,
        })),
      })),
    };
    res.status(201).json(newCategory);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Register a new candidate
router.post("/candidate/:category_id", verifyAdminToken, async (req, res) => {
  const name = req.body.name;
  const pollId = req.body.pollId;

  const category_id = req.params.category_id;
  const data = {
    name,
  };

  try {
    const poll = await Polls.findById(pollId);
    const nameArr = poll.categories
      .filter((item) => item._id == category_id)[0]
      .candidate.map((item) => item.name);

    const isDuplicate = nameArr.includes(name) ? true : false;
    console.log(isDuplicate);
    if (isDuplicate) {
      return res.status(406).json({ message: "Candidate already exist" });
    }
    poll.categories.id(category_id).candidate.push(data);

    poll.save();

    const newPoll = {
      name: poll.name,
      _id: poll._id,

      categories: poll.categories.map((item) => ({
        name: item.name,
        _id: item._id,

        candidate: item.candidate.map((obj) => ({
          name: obj.name,
          _id: obj._id,
        })),
      })),
    };
    res.sendStatus(201).json(newPoll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
//The new vote a candidate
router.post("/vote", verifyToken, async (req, res) => {
  const pollId = req.body.pollId;
  const vote = req.body.vote;
  const mobile_id = req.data.mobile_id;
  try {
    if (!(await Polls.findById(pollId))) {
      res.sendStatus(404);
    }
    const poll = await Polls.findById(pollId);
    if (poll.voters.includes(mobile_id)) {
      return res.sendStatus(400);
    }
    const categoryLength = vote.categories.length;
    for (let i = 0; i < categoryLength; i++) {
      if (poll.categories[i].voters.includes(mobile_id)) {
        return res.sendStatus(400);
      }
      const candidateLength = vote.categories[i].candidate.length;
      for (let j = 0; j < candidateLength; j++) {
        if (vote.categories[i].candidate[j].voted) {
          //all actions for categories
          poll.categories.id(vote.categories[i]._id).voters.push(mobile_id);
          poll.categories.id(vote.categories[i]._id).votes++;
          //all actions for candidates
          poll.categories
            .id(vote.categories[i]._id)
            .candidate.id(vote.categories[i].candidate[j]._id)
            .voters.push(mobile_id);
          poll.categories
            .id(vote.categories[i]._id)
            .candidate.id(vote.categories[i].candidate[j]._id).votes++;
        }
      }
    }
    poll.voters.push(mobile_id);
    poll.votes++;
    poll.save();
    res.sendStatus(200);
  } catch (error) {
    res.json({ message: error.message });
  }
});
//stats
router.get("/stats/:pollId", verifyToken, async (req, res) => {
  const pollId = req.params.pollId;
  try {
    const poll = await Polls.findById(pollId);
    if (!poll) {
      return res.sendStatus(404);
    }
    const categories = poll.categories;
    const totalVoters = poll.votes;
    const categoryStat = categories.map((item) => ({
      name: item.name,
      _id: item._id,
      totalVoters: item.votes,
      candidates: item.candidate.sort((a, b) => b.votes - a.votes),
    }));
    res.json({ totalVoters, categoryStat });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//delete a candidate
router.delete(
  "/category/:category_id/candidate/:candidate_id",
  verifyAdminToken,
  async (req, res) => {
    const category_id = req.params.category_id;
    const candidate_id = req.params.candidate_id;
    const pollId = req.body.pollId;

    try {
      const poll = await Polls.findById(pollId);

      // const filter = poll.categories
      //   .id(category_id) //eslint-disable-next-line
      //   .candidate.filter((item) => item._id != candidate_id);
      // if (filter == null) {
      //   return res.sendStatus(404);
      // }
      // poll.categories.id(category_id).candidate = filter;
      poll.categories.id(category_id).candidate.id(candidate_id).remove();
      poll.save();

      const newPoll = {
        name: poll.name,
        _id: poll._id,

        categories: poll.categories.map((item) => ({
          name: item.name,
          _id: item._id,

          candidate: item.candidate.map((obj) => ({
            name: obj.name,
            _id: obj._id,
          })),
        })),
      };
      res.json(newPoll);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);
//delete a category
router.delete("/category/:category_id", verifyAdminToken, async (req, res) => {
  const category_id = req.params.category_id;
  const pollId = req.body.pollId;
  try {
    const poll = await Polls.findById(pollId);
    poll.categories.id(category_id).remove();
    poll.save();
    const newPoll = {
      name: poll.name,
      _id: poll._id,

      categories: poll.categories.map((item) => ({
        name: item.name,
        _id: item._id,

        candidate: item.candidate.map((obj) => ({
          name: obj.name,
          _id: obj._id,
        })),
      })),
    };
    res.json(newPoll);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//delete a poll
router.delete("/", verifyAdminToken, async (req, res) => {
  const pollId = req.body.pollId;

  try {
    const poll = await Polls.findById(pollId);
    if (!poll) {
      return res.sendStatus(404);
    }
    poll.remove();
    poll.save();
    const data = poll.map((item) => ({
      name: item.name,
      _id: item._id,
      deadline: item.deadline,
    }));
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
