const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const secret_token = process.env.JWT_SECRET;

router.post(
  "/signup",
  body("email").trim().isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 8 })
    .notEmpty()
    .withMessage("Le mot de passe doit contenir minimun 8 characteres "),
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

router.post(
  "/signin",
  body("password").notEmpty(),
  body("username").notEmpty(),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          result: false,
          erreur: "Username ou mot de passe invalide",
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          result: false,
          error: "Username ou mot de passe invalide",
        });
      }
      const token = jwt.sign({ username }, secret_token, {
        expiresIn: "1h",
      });
      user = await User.findOneAndUpdate(
        { username },
        { $set: { token } },
        { returnDocument: "after" },
      );
      const { password: hashedPassword, ...userWihoutPassword } =
        user.toObject();
      res.status(200).json({
        result: true,
        data: userWihoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        result: false,
        error: "Erreur serveur",
      });
      console.error(error);
    }
  },
);

module.exports = router;
