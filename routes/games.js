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
      params = "ordering=-added&dates=2026-01-01,2026-12-31&page_size=20";
      break;
    case "recent":
      params = "ordering=-released&dates=2025-01-01,2026-04-17&page_size=20 ";
      break;
    case "upcoming":
      params = `dates=2026-04-17,2026-12-31&ordering=-added&page_size=20`;
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID manquant" });
  try {
    const [gameResponse, screenshotsResponse] = await Promise.all([
      fetch(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`),
      fetch(
        `https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_API_KEY}`,
      ),
    ]);

    const data = await gameResponse.json();
    const screenshotsData = await screenshotsResponse.json();
    console.log("screenshot => ", screenshotsData);

    if (gameResponse.status !== 200 || screenshotsResponse.status !== 200) {
      return res.status(400).json({ result: false, error: "Jeu non trouvé" });
    }
    const gameDetails = {
      rawgId: data.id,
      title: data.name,
      description: data.description_raw,
      released: data.released,
      backgroundImage: data.background_image,
      rating: data.rating,
      metacritic: data.metacritic,
      genre: data.genres?.map((e) => e.name),
      platforms: data.platforms?.map((e) => e.platform.name),
      developers: data.developers?.map((e) => e.name),
      communtyStats: data.added_by_status,
      screenshots: screenshotsData.results?.map((s) => s.image),
    };
    console.log(gameDetails);

    res.json({ result: true, data: gameDetails });
  } catch (error) {
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});
module.exports = router;
