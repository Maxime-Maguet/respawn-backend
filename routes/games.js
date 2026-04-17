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

router.get("/discover", async (req, res) => {
  const { type } = req.query;
  let params = "";
  if (!type) {
    return res.status(400).json({ result: true, error: "Type invalide" });
  }
  switch (type) {
    case "trending":
      params = "ordering=-added&dates=2026-01-01,2026-12-31&page_size=8";
      break;
    case "recent":
      params = "ordering=-released&dates=2025-01-01,2026-04-17&page_size=8 ";
      break;
    case "upcoming":
      params = `dates=2026-04-17,2026-12-31&ordering=-added&page_size=8`;
      break;
  }
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&${params}`,
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
