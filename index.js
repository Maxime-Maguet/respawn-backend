require("dotenv").config();

const express = require("express");
const app = express();

require("./models/connection");

const userRouter = require("./routes/users");
const gameRouter = require("./routes/games");
const libraryRouter = require("./routes/libraries");

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/game", gameRouter);
app.use("/library", libraryRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
