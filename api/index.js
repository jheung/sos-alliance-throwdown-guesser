const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const indexRouter = require("./routes/index");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use("/api/process", indexRouter);

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));

module.exports = app;
