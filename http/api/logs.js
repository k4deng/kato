// Dependencies
const express = require("express");
const	fs = require("fs");
const	router = express.Router();

// Guild page
module.exports = () => {
  // Get basic information on guild
  router.get("/", async (req, res) => {
    const date = req.query.date ?? new Date().toLocaleDateString("EN-GB").split("/").reverse().join(".");
    try {
      const data = fs.readFileSync(`${process.cwd()}/data/logs/roll-${date}.log`, "utf8");
      res.status(200).json({ date, logs: data.split(" \n") });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};