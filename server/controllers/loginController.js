const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request",
    });
  }
});

module.exports = router;
