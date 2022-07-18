// This event executes when a new guild (server) is left.
const logger = require("../modules/logger.js");

module.exports = (client, guild) => {
  if (!guild.available) return; // If there is an outage, return.
  
  logger.cmd(`[GUILD LEAVE] ${guild.id} removed the bot.`);

  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
};
