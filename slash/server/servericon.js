const { EmbedBuilder } = require("discord.js");
const { error } = require("../../modules/messages.js");
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

  const png = interaction.guild.iconURL({ extension: "png", size: 1024 });
  const jpg = interaction.guild.iconURL({ extension: "jpg", size: 1024 });
  const gif = interaction.guild.iconURL({ extension: "gif", size: 1024 });
  const webp = interaction.guild.iconURL({ extension: "webp", size: 1024 });
  
  // Check for guild icon & send message
  if (interaction.guild.icon) {
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name}'s icon`)
      .setDescription(`**Links:**\n[png](${png}) | [jpg](${jpg}) | [gif](${gif}) | [webp](${webp})`)
      .setImage(`${interaction.guild.iconURL({ dynamic: true, size: 1024 })}`)
      .setColor(themeColor);
    interaction.reply({ embeds: [embed] });
  } else {
    interaction.reply({ embeds: [error("This server does not have a server icon.", interaction, false, true)] });
  }
};

exports.commandData = {
  name: "servericon",
  description: "Get the server's icon.",
  category: "Server",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};