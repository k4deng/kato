const { MessageEmbed } = require('discord.js');
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const member = interaction.guild.members.cache.get(interaction.options.get('user')?.value ?? interaction.user.id);
  const embed = new MessageEmbed()
    .setTitle(`${member.user.tag}'s avatar`)
    .setDescription(`**Links:**\n[png](${member.user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${member.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${member.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${member.user.displayAvatarURL({ format: 'webp', size: 1024 })})`)
    .setImage(`${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
    .setColor(themeColor);
  interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "avatar",
  description: "View a user's avatar.",
  category: "Server",
  options: [{
    name: 'user',
    type: 'USER',
    description: 'The user you want the avatar of',
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