const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { themeColor } = require("../../config.js");
const moment = require("moment");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const member = interaction.guild.members.cache.get(interaction.options.get("user")?.value ?? interaction.user.id);
  
  const status = (member.presence?.activities.length >= 1)
    ? `${member.presence.activities[0].name}${(member.presence.activities[0].type === 4)
      ? " - " + member.presence.activities[0].state : ""}`
    : "None";
  
  const embed = new EmbedBuilder()
    .setAuthor({ name: `${member.user.username}'s info` , iconURL: member.user.displayAvatarURL() })
    .setColor(themeColor)
    .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 512 }))
    .addFields(
      { name: "Username", value: member.user.username, inline: true },
      { name: "Discriminator", value: `${member.user.discriminator}`, inline: true },
      { name: "Robot", value: `${member.user.bot ? "Yes" : "No"}`, inline: true },
      { name: "Creation", value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:D>`, inline: true },
      { name: "Activity", value: `\`${status}\``, inline: true },
      { name: "Highest role", value: `${member.roles.highest}`, inline: true },
      { name: "Join", value: `<t:${moment(member.joinedAt).unix()}:D>`, inline: true },
      { name: "Nickname", value: member.nickname != null ? member.nickname : "None", inline: true },
      { name: "Roles", value: member.roles.cache.size > 1 ? member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).reduce((a, b) => `${a}, ${b}`) : "@everyone" },
    )
    .setTimestamp()
    .setFooter({ text: `Requested by: ${interaction.user.username}` });
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "userinfo",
  description: "Get information on a user.",
  category: "Server",
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "The user you want information of",
    required: false,   
  }],
  dmPermission: false,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};