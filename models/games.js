const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    rawgId: Number,
    title: String,
    released: String,
    backgroundImage: String,
    genres: [{ id: Number, name: String }],
    description: String,
  },
  { timestamps: true },
);

const Game = mongoose.model("games", gameSchema);

module.exports = Game;
