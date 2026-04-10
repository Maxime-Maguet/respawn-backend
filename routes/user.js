const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const authMiddleware = require("../middleware/auth.js");

router.get("/", authMiddleware, (req, res) => {
  User.find().then((data) => {
    res.json({ result: true, allData: data });
  });
});

module.exports = router;
