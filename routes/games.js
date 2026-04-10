const express = require("express");
const router = express.Router();
const Game = require("../models/games.js");

const RAWG_API_KEY = process.env.RAWG_API_KEY;

router.get("/search", async (req, res) => {
  const { page_size, search } = req.query;

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${search}&page_size=${page_size}`,
    );
    const data = await response.json();

    const gameInformations = data.results.map((data) => {
      return {
        rawgId: data.id,
        title: data.name,
        released: data.released,
        backgroundImage: data.background_image,
        genres: data.genres,
      };
    });

    res.json(gameInformations);
  } catch (error) {
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
