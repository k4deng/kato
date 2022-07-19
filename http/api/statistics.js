// Dependecies
const { ChannelType } = require("discord.js");
const express = require("express");
const router = express.Router();
const moment = require("moment");

module.exports = function(client) {

  // statistics page
  router.get("/", async function(req, res) {
    res.status(200).json({
      guildCount: client.guilds.cache.size,
      cachedUsers: client.users.cache.size,
      totalMembers: client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0),
      uptime: moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [seconds]"),
      commandCount: client.container.commands.size,
      slashCommandCount: client.container.slashcmds.size,
      memoryUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      textChannels: client.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size,
      voiceChannels: client.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size,
      ping: Math.round(client.ws.ping),
    });
  });

  return router;
};
