const mongoose = require("mongoose");

const librarySchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "games" },
    status: {
      type: String,
      enum: ["en cours", "terminé", "abandonné", "pas encore joué"],
    },
    rating: Number,
    likes: [String],
    dislikes: [String],
    journal: [{ date: Date, note: String }],
  },
  { timestamps: true },
);

const Library = mongoose.model("Librairies", librarySchema);

module.exports = Library;
