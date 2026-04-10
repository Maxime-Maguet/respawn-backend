const express = require("express");
const router = express.Router();
const Library = require("../models/libraries.js");
const User = require("../models/users.js");
const authMiddleware = require("../middleware/auth.js");
const Game = require("../models/games.js");
const RAWG_API_KEY = process.env.RAWG_API_KEY;

router.post("/addGame", authMiddleware, async (req, res) => {
  const { rawgId } = req.body;
  const { username } = req.user;

  try {
    const user = await User.findOne({ username });
    let game = await Game.findOne({ rawgId });

    if (!game) {
      const response = await fetch(
        `https://api.rawg.io/api/games/${rawgId}?key=${RAWG_API_KEY}`,
      );
      const data = await response.json();
      const newGame = new Game({
        rawgId: data.id,
        title: data.name,
        released: data.released,
        backgroundImage: data.background_image,
        genres: data.genres,
      });
      await newGame.save();
      game = newGame;
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
    console.error(err);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const { username } = req.user;
  try {
    const user = await User.findOne({ username });
    const library = await Library.find({ user: user._id }).populate("game");
    if (!library) {
      res.status(404).json({ result: false, error: "Librairie non trouvée" });
    }
    res.json({ result: true, allData: library });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.delete("/removeLibrary/:libraryId", authMiddleware, async (req, res) => {
  const { username } = req.user;
  try {
    const user = await User.findOne({ username });
    const librairyExist = await Library.findOne({
      _id: req.params.libraryId,
      user: user._id,
    });
    if (!librairyExist) {
      return res
        .status(404)
        .json({ result: false, details: "Librairie n'existe pas" });
    }
    await Library.findByIdAndDelete(req.params.libraryId);
    res.status(200).json({ result: true, message: "Librairie supprimée" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.put("/updateLibrary/:libraryId", authMiddleware, async (req, res) => {
  const { username } = req.user;
  const id = req.params.libraryId;
  const updatedData = req.body;
  try {
    const user = await User.findOne({ username });
    const librairyExist = await Library.findOneAndUpdate(
      {
        _id: id,
        user: user._id,
      },
      {
        $set: {
          status: updatedData.status,
          likes: updatedData.likes,
          dislikes: updatedData.dislikes,
          journal: updatedData.journal,
        },
      },
      { returnDocument: "after" },
    );
    if (!librairyExist) {
      return res
        .status(404)
        .json({ result: false, error: "Lirairie non trouvée" });
    }
    res.json({ result: true, data: librairyExist });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
