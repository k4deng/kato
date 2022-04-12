const { MessageEmbed } = require('discord.js');
const { themeColor } = require("../../config.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const embed = new MessageEmbed()
    .setTitle(duration)
    .setColor(themeColor);
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "uptime",
  description: "The bot's uptime",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};