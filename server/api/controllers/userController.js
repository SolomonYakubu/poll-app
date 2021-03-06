require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { verifyPhoneNumber } = require("nigerian-phone-number-validator");

/**
 *
 * @param {*} req
 * @param {*} res
 */
const registerUser = async (req, res) => {
  const name = req.body.name;
  const mobile_id = req.body.mobile_id;
  const admin_no = process.env.ADMIN_NO;
  if (!verifyPhoneNumber(mobile_id) && mobile_id !== admin_no) {
    return res.status(406).json({ message: "Mobile number not valid" });
  }
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
      expiresIn: "1h",
    });
    res.status(201).json({ newUser, token });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const mobile_id = req.body.mobile_id;
  const admin_no = process.env.ADMIN_NO;

  if (mobile_id === admin_no) {
    const adminToken = jwt.sign({ mobile_id }, process.env.ADMIN_TOKEN_SECRET, {
      expiresIn: "5h",
    });
    const token = jwt.sign({ mobile_id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ mobile_id, token, adminToken });
  } else {
    try {
      const id = await User.findOne({ mobile_id });
      if (id) {
        const token = jwt.sign({ mobile_id }, process.env.TOKEN_SECRET, {
          expiresIn: "1h",
        });
        res.json({ mobile_id, token });
      } else {
        res.status(404).json({ message: "Mobile_id not registered" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  }
};
module.exports = {
  registerUser,
  loginUser,
};
