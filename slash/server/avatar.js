const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const member = interaction.guild.members.cache.get(interaction.options.get("user")?.value ?? interaction.user.id);

  const png = member.user.displayAvatarURL({ extension: "png", size: 1024 });
  const jpg = member.user.displayAvatarURL({ extension: "jpg", size: 1024 });
  const gif = member.user.displayAvatarURL({ extension: "gif", size: 1024 });
  const webp = member.user.displayAvatarURL({ extension: "webp", size: 1024 });
  
  const embed = new EmbedBuilder()
    .setTitle(`${member.user.tag}'s avatar`)
    .setDescription(`**Links:**\n[png](${png}) | [jpg](${jpg}) | [gif](${gif}) | [webp](${webp})`)
    .setImage(`${member.user.displayAvatarURL({ size: 1024 })}`)
    .setColor(themeColor);
  interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "avatar",
  description: "View a user's avatar.",
  category: "Server",
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "The user you want the avatar of",
    required: false,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};