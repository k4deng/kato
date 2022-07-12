// Dependecies
const express = require("express"),
  router = express.Router();
const moment = require("moment");

module.exports = function(client) {

  // statistics page
  router.get("/", async function(req, res) {
    res.status(200).json({
      guildCount: client.guilds.cache.size,
      userCount: client.users.cache.size,
      uptime: moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [seconds]"),
      commandCount: client.container.commands.size,
      memoryUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      textChannels: client.channels.cache.filter(channel => channel.type === "GUILD_TEXT").size,
      voiceChannels: client.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size,
    });
  });

  return router;
};
