require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/userAuth");
router.get("/", verifyToken, (req, res) => {
  res.send("Hello world");
});

router.post("/register", async (req, res) => {
  const name = req.body.name;
  const mobile_id = req.body.mobile_id;

  try {
    if (await User.findOne({ mobile_id })) {
      return res.status(403).json({ message: "Mobile_id already exist" });
    }
    const user = new User({
      name,
      mobile_id,
    });
    const newUser = await user.save();
    const token = jwt.sign({ mobile_id }, process.env.TOKEN_SECRET, {
      expiresIn: "30m",
    });
    res.status(201).json({ newUser, token });
  } catch (error) {
    res.json({ message: error.message });
  }
});
router.post("/log-in", async (req, res) => {
  const mobile_id = req.body.mobile_id;
  const admin_no = process.env.ADMIN_NO;

  if (mobile_id === admin_no) {
    const adminToken = jwt.sign({ mobile_id }, process.env.ADMIN_TOKEN_SECRET, {
      expiresIn: "5h",
    });
    const token = jwt.sign({ mobile_id }, process.env.TOKEN_SECRET, {
      expiresIn: "30m",
    });

    return res.json({ token, adminToken });
  } else {
    try {
      const id = await User.findOne({ mobile_id });
      if (id) {
        const token = jwt.sign({ mobile_id }, process.env.TOKEN_SECRET, {
          expiresIn: "30m",
        });
        res.json({ message: "Successfully logged in", mobile_id, token });
      } else {
        res.status(404).json({ message: "Mobile_id not registered" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  }
});

module.exports = router;
