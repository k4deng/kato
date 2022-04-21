const logger = require("../modules/logger.js");
module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");


  // makes sure that client.application has latest info
  client.application = await client.application.fetch();
  
  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`/help`, { type: "WATCHING" });

  //init dashboard
  try {
    require('../modules/dashboard/app')(client);
	} catch (err) {
		logger.error(err);
  }
};
