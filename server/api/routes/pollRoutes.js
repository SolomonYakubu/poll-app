const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/userAuth");
const authenticateAdmin = require("../middlewares/adminAuth");
const checkDeadline = require("../middlewares/checkDeadline");

const pollController = require("../controllers/pollController");

// get all Polls
router.get("/", pollController.getAllPolls);
//get poll by id
router.get(
  "/:id",
  [authenticateUser, checkDeadline],
  pollController.getPollById
);
// Create a new Poll
router.post("/", authenticateAdmin, pollController.createPoll);
//Register a new category
router.post("/category", authenticateAdmin, pollController.registerCategory);
// Register a new candidate
router.post(
  "/candidate/:category_id",
  authenticateAdmin,
  pollController.registerCandidate
);
//The new vote a candidate
router.post("/vote", authenticateUser, pollController.castVote);
//stats
router.get("/stats/:pollId", authenticateUser, pollController.getStats);

//delete a candidate
router.delete(
  "/candidate/:candidate_id",
  authenticateAdmin,
  pollController.deleteCandidate
);
//delete a category
router.delete(
  "/category/:category_id",
  authenticateAdmin,
  pollController.deleteCategory
);

//delete a poll
router.delete("/", authenticateAdmin, pollController.deletePoll);

module.exports = router;
