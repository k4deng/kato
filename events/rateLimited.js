const { EmbedBuilder, Colors } = require("discord.js");
const logger = require("../modules/logger.js");
const config = require("../config.js");

module.exports = async (client, { route, timeToReset, limit }) => {
  logger.error(`Rate limit: ${route} (Cooldown: ${timeToReset}ms)`);

  const embed = new EmbedBuilder()
    .setTitle("RateLimit hit")
    .setColor(Colors.Red)
    .addFields([
      { name: "Path", value: `${route}` },
      { name: "Limit", value: `${limit}`, inline: true },
      { name: "Cooldown", value: `${timeToReset}ms`, inline: true },
    ])
    .setTimestamp();

  const modChannel = await client.channels.fetch(config.rateLimitChannelID).catch(() => logger.error("Error fetching rate limit logging channel"));
  if (modChannel) modChannel.send({ embeds: [embed] });
};
