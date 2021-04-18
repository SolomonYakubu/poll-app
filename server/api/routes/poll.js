require("dotenv").config();

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/userAuth");
const verifyAdminToken = require("../auth/adminAuth");
const Polls = require("../models/polls");
const Categories = require("../models/category");
const Candidates = require("../models/candidates");

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
    const polls = await Polls.findById(pollId);
    if (!polls) {
      res.sendStatus(404);
    }
    const poll = await polls
      .populate({ path: "categories", populate: { path: "candidates" } })
      .execPopulate();
    const data = {
      name: poll.name,
      _id: poll._id,
      voted: poll.voters.includes(mobile_id) ? true : false,
      categories: poll.categories.map((item) => ({
        name: item.name,
        _id: item._id,
        voted: item.voters.includes(mobile_id) ? true : false,
        candidates: item.candidates.map((obj) => ({
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

    const nameArr = (
      await poll.populate("categories").populate("candidates").execPopulate()
    ).categories.map((item) => item.name);

    const isDuplicate = nameArr.includes(name) ? true : false;

    if (isDuplicate) {
      return res.status(406).json({ message: "category already exist" });
    }
    const category = new Categories({ name });
    const newCategory = await category.save();

    poll.categories = [...poll.categories, newCategory._id];
    const newPoll = await (await poll.save())
      .populate({
        path: "categories",
        select: ["name", "_id"],

        populate: {
          path: "candidates",
          select: ["name", "_id"],
        },
      })
      .execPopulate();
    const data = {
      name: newPoll.name,
      _id: newPoll._id,

      categories: newPoll.categories,
    };
    res.status(201).json(data);
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
    const category = await Categories.findById(category_id);
    const nameArr = (
      await category.populate("candidates").execPopulate()
    ).candidates.map((item) => item.name);

    const isDuplicate = nameArr.includes(name) ? true : false;

    if (isDuplicate) {
      return res.status(406).json({ message: "Candidate already exist" });
    }

    const candidate = new Candidates(data);
    const newCandidate = await candidate.save();

    category.candidates = [...category.candidates, newCandidate._id];
    await category.save();

    const currentPoll = await poll
      .populate({
        path: "categories",
        select: ["name", "_id"],

        populate: {
          path: "candidates",
          select: ["name", "_id"],
        },
      })
      .execPopulate();

    const newPoll = {
      name: currentPoll.name,
      _id: currentPoll._id,

      categories: currentPoll.categories,
    };
    res.status(201).json(newPoll);
  } catch (error) {
    res.json({ message: error.message });
  }
});
//The new vote a candidate
router.post("/vote", verifyToken, async (req, res) => {
  const pollId = req.body.pollId;
  const vote = req.body.vote;
  const mobile_id = req.data.mobile_id;
  const verifyArr = vote.categories.map((item) => item.voted);
  if (!verifyArr.every((val) => val === true)) {
    return res.sendStatus(400);
  }
  try {
    if (!(await Polls.findById(pollId))) {
      return res.sendStatus(404);
    }
    const poll = await Polls.findById(pollId);

    if (poll.voters.includes(mobile_id)) {
      return res.sendStatus(400);
    }

    vote.categories.map(async (item) => {
      //eslint-disable-next-line
      if (item.voted) {
        let categories = await Categories.findById(item._id);
        categories.votes += 1;
        categories.voters = [...categories.voters, mobile_id];
        await categories.save();
      }
      item.candidates.map(async (obj) => {
        if (obj.voted) {
          //codes for categories

          // Categories.findById(item._id, (err, category) => {
          //   category.votes++;
          //   category.voters = [...category.voters, mobile_id];
          //   category.save();
          //   Candidates.findById(obj._id, (err, candidate) => {
          //     candidate.votes++;
          //     candidate.voters = [...candidate.voters, mobile_id];
          //     candidate.save();
          //   });
          // });

          // Categories.findById(item._id)
          //   .then((category) => {
          //     category.votes++;
          //     category.voters = [...category.voters, mobile_id];
          //     category.save();
          //   })
          //   .catch((err) => res.json({ message: err.message }));

          // Candidates.findById(obj._id)
          //   .then((candidate) => {
          //     candidate.votes++;
          //     candidate.voters = [...candidate.voters, mobile_id];
          //     candidate.save();
          //   })
          //   .catch((err) => res.json({ message: err.message }));
          //codes for candidates
          let candidate = await Candidates.findById(obj._id);
          candidate.votes++;
          candidate.voters = [...candidate.voters, mobile_id];

          await candidate.save();
        }
      });
    });
    poll.votes++;
    poll.voters = [...poll.voters, mobile_id];
    await poll.save();
    // Polls.findById(pollId)
    //   .then((poll) => {
    //     poll.votes++;
    //     poll.voters = [...poll.voters, mobile_id];
    //     poll.save();
    //   })
    //   .catch((err) => res.json({ message: err.message }));
    res.sendStatus(200);
  } catch (error) {
    res.json({ message: error.message });
  }
});
//stats
router.get("/stats/:pollId", verifyToken, async (req, res) => {
  const pollId = req.params.pollId;
  try {
    const polls = await Polls.findById(pollId);
    if (!polls) {
      return res.sendStatus(404);
    }
    const poll = await polls
      .populate({ path: "categories", populate: { path: "candidates" } })
      .execPopulate();
    const categories = poll.categories;
    const totalVoters = poll.votes;
    const data = categories.map((item) => ({
      name: item.name,
      _id: item._id,
      totalVoters: item.votes,
      candidates: item.candidates.map((obj) => ({
        votes: obj.votes,
        _id: obj._id,
        name: obj.name,
      })),
    }));
    const categoryStat = data.map((item) => ({
      name: item.name,
      _id: item._id,
      totalVoters: item.totalVoters,
      candidates: item.candidates.sort((a, b) => b.votes - a.votes),
    }));

    res.json({ totalVoters, categoryStat });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//delete a candidate
router.delete(
  "/candidate/:candidate_id",
  verifyAdminToken,
  async (req, res) => {
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
      await Candidates.findById(candidate_id).remove();

      const newPoll = await (await poll.save())
        .populate({
          path: "categories",
          select: ["name", "_id"],

          populate: {
            path: "candidates",
            select: ["name", "_id"],
          },
        })
        .execPopulate();
      const data = {
        name: newPoll.name,
        _id: newPoll._id,

        categories: newPoll.categories,
      };
      res.status(201).json(data);
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
    await Categories.findById(category_id).remove();

    const newPoll = await (await poll.save())
      .populate({
        path: "categories",
        select: ["name", "_id"],

        populate: {
          path: "candidates",
          select: ["name", "_id"],
        },
      })
      .execPopulate();
    const data = {
      name: newPoll.name,
      _id: newPoll._id,

      categories: newPoll.categories,
    };
    res.status(201).json(data);
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
