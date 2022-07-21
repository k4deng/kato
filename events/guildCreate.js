// This event executes when a new guild (server) is joined.
const logger = require("../modules/logger.js");

module.exports = (client, guild) => {
  logger.cmd(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
};
