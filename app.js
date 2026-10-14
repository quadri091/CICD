const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World"));

app.get("/status", (req, res) =>
  res.json({ status: "Server is healthy ✅", uptime: process.uptime() }),
);

module.exports = app;
