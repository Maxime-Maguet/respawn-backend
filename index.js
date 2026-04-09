require("dotenv").config();

const express = require("express");
const app = express();

require("./models/connection");

const cors = require("cors");
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
