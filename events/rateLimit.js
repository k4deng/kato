const { MessageEmbed } = require("discord.js");
const logger = require("../modules/logger.js");
const config = require("../config.js");

module.exports = async (client, { route, timeout, limit }) => {
  logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);

  const embed = new MessageEmbed()
    .setTitle("RateLimit hit")
    .setColor("RED")
    .addField("Path", route)
    .addField("Limit", `${limit}`, true)
    .addField("Cooldown", `${timeout}ms`, true)
    .setTimestamp();

  const modChannel = await client.channels.fetch(config.rateLimitChannelID).catch(() => logger.error("Error fetching rate limit logging channel"));
  if (modChannel) modChannel.send({ embeds: [embed] });
};
