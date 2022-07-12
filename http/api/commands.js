// Dependecies
const express = require("express"),
  router = express.Router();

// Command page
module.exports = function(client) {
  // Show list of commands
  router.get("/", function(req, res) {
    const categories = client.container.commands
      .map(c => c.help.category)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b)
      .map(category => ({
        name: category,
        commands: client.container.commands.filter(c => c.help.category === category)
          .array()
          .sort((a, b) => a.help.name - b.help.name)
          .map(c => c.help.name),
      }));

    res.status(200).json({
      categories,
    });
  });

  // Show information on a particular command
  router.get("/:command", function(req, res) {
    if (client.container.commands.get(req.params.command) || client.container.commands.get(client.aliases.get(req.params.command))) {
      const command = client.container.commands.get(req.params.command) || client.container.commands.get(client.aliases.get(req.params.command));
      res.status(200).json({
        command,
      });
    } else {
      res.status(400).json({ error: "Invalid command!" });
    }
  });

  return router;
};
