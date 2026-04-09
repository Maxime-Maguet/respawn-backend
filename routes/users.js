const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const secret_token = process.env.JWT_SECRET;

router.post(
  "/signup",
  body("email").trim().isEmail(),
  body("password").isLength({ min: 5 }).notEmpty(),
  body("username").notEmpty(),
  async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const data = await User.findOne({ $or: [{ email }, { username }] });
      if (data) {
        res.json({ result: false, error: "Utilisateur existe déjà" });
      } else {
        const hash = await bcrypt.hash(password, 10);
        const token = jwt.sign({ username }, secret_token, {
          expiresIn: "1h",
        });
        const newUser = new User({
          username,
          email,
          password: hash,
          token,
        });
        await newUser.save();
        res.json({ result: true, user: { username, token } });
      }
    } catch (error) {
      res.status(500).json({ result: false, error: "Erreur serveur" });
    }
  },
);

module.exports = router;
