const { EmbedBuilder } = require("discord.js");
const { themeColor } = require("../../config.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const embed = new EmbedBuilder()
    .setTitle(duration)
    .setColor(themeColor);
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "uptime",
  description: "The bot's uptime",
  category: "Misc",
  options: [],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};