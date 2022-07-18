const { EmbedBuilder } = require("discord.js");
const logger = require("../modules/logger.js");
const config = require("../config.js");

module.exports = async (client, { route, timeout, limit }) => {
  logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);

  const embed = new EmbedBuilder()
    .setTitle("RateLimit hit")
    .setColor("RED")
    .addFields([
      { name: "Path", value: route },
      { name: "Limit", value: limit, inline: true },
      { name: "Cooldown", value: `${timeout}ms`, inline: true },
    ])
    .setTimestamp();

  const modChannel = await client.channels.fetch(config.rateLimitChannelID).catch(() => logger.error("Error fetching rate limit logging channel"));
  if (modChannel) modChannel.send({ embeds: [embed] });
};
