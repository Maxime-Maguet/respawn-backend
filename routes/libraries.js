const express = require("express");
const router = express.Router();
const Library = require("../models/libraries.js");
const User = require("../models/users.js");
const authMiddleware = require("../middleware/auth.js");
const Game = require("../models/games.js");

router.post("/addGame", authMiddleware, async (req, res) => {
  const { rawgId } = req.body;
  const { username } = req.user;
  try {
    const user = await User.findOne({ username });
    const game = await Game.findOne({ rawgId });
    if (!game) {
      return res.status(401).json({
        result: false,
        erreur: "Jeu non trouvé",
      });
    }
    const library = await Library.findOne({ game: game._id, user: user._id });
    if (library) {
      return res.json({ result: false, error: "Jeu déjà enregistré" });
    } else {
      const newLibrary = new Library({
        user: user._id,
        game: game._id,
      });
      await newLibrary.save();
      res.json({ result: true, details: newLibrary._id });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
