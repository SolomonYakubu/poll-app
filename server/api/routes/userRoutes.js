const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/log-in", loginUser);

module.exports = router;
