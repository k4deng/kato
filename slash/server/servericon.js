const { MessageEmbed } = require('discord.js');
const { error } = require("../../modules/messages.js");
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const channel = interaction.guild.channels.cache.get(interaction.guild.id);
  // Check for guild icon & send message
  if (interaction.guild.icon) {
    const embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name}'s icon`)
      .setDescription(`**Links:**\n[png](${interaction.guild.iconURL({ format: 'png', size: 1024 })}) | [jpg](${interaction.guild.iconURL({ format: 'jpg', size: 1024 })}) | [gif](${interaction.guild.iconURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${interaction.guild.iconURL({ format: 'webp', size: 1024 })})`)
      .setImage(`${interaction.guild.iconURL({ dynamic: true, size: 1024 })}`)
      .setColor(themeColor);
    interaction.reply({ embeds: [embed] });
  } else {
    interaction.reply({ embeds: [error('This server does not have a server icon.', interaction, false, true)] });
  }
};

exports.commandData = {
  name: "servericon",
  description: "Get the server\'s icon.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};