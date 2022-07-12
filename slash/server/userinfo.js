const { MessageEmbed } = require("discord.js");
const { themeColor } = require("../../config.js");
const { toProperCase } = require("../../modules/functions.js");
const moment = require("moment");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const member = interaction.guild.members.cache.get(interaction.options.get("user")?.value ?? interaction.user.id);
  
  const status = (member.presence && member.presence?.activities.length >= 1) ? `${toProperCase(member.presence.activities[0].type)} - ${(member.presence.activities[0].type == "CUSTOM") ? member.presence.activities[0].state : member.presence.activities[0].name}` : "None";
  
  const embed = new MessageEmbed()
    .setAuthor(`${member.user.tag}'s info`, member.user.displayAvatarURL())
    .setColor(themeColor)
    .setThumbnail(member.user.displayAvatarURL({ format: "png", size: 512 }))
    .addFields(
      { name: "Username", value: member.user.username, inline: true },
      { name: "Discriminator", value: `${member.user.discriminator}`, inline: true },
      { name: "Robot", value: `${member.user.bot ? "Yes" : "No"}`, inline: true },
      { name: "Creation", value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:D>`, inline: true },
      { name: "User Status", value: `\`${status}\``, inline: true },
      { name: "Highest role", value: `${member.roles.highest}`, inline: true },
      { name: "Join", value: `<t:${moment(member.joinedAt).unix()}:D>`, inline: true },
      { name: "Nickname", value: member.nickname != null ? member.nickname : "None", inline: true },
      { name: "Roles", value: member.roles.cache.size > 1 ? member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).reduce((a, b) => `${a}, ${b}`) : "@everyone" },
    )
    .setTimestamp()
    .setFooter(`Requested by: ${interaction.user.tag}`);
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "userinfo",
  description: "Get information on a user.",
  category: "Server",
  options: [{
    name: "user",
    type: "USER",
    description: "The user you want information of",
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