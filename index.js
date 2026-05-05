require("dotenv").config();

const express = require("express");
const app = express();

require("./models/connection");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const gameRouter = require("./routes/games");
const libraryRouter = require("./routes/libraries");

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/game", gameRouter);
app.use("/library", libraryRouter);
app.use("/user", userRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
