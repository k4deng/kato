// Dependecies
const express = require("express");
const router = express.Router();

// Command page
module.exports = function(client) {
  // Show list of commands
  router.get("/", function(req, res) {
    const categories = client.container.slashcmds
      .map(c => c.commandData.category)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b)
      .map(category => ({
        name: category,
        commands: client.container.slashcmds.filter(c => c.commandData.category === category)
          .sort((a, b) => a.commandData.name - b.commandData.name)
          .map(c => c.commandData.name),
      }));

    res.status(200).json({ categories });
  });

  // Show information on a particular command
  router.get("/:command", function(req, res) {
    if (client.container.slashcmds.get(req.params.command) || client.container.slashcmds.get(client.aliases.get(req.params.command))) {
      const command = client.container.slashcmds.get(req.params.command) || client.container.slashcmds.get(client.aliases.get(req.params.command));
      res.status(200).json({
        command,
      });
    } else {
      res.status(400).json({ error: "Invalid command!" });
    }
  });

  return router;
};
