const { MessageEmbed } = require("discord.js");
const { themeColor } = require("../../config.js");
const moment = require("moment");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const guild = interaction.guild;
  const user = interaction.member.user;
  
  const roles = [...guild.roles.cache.sort((a, b) => b.position - a.position).values()];
  while (roles.join(", ").length >= 1021) {
    roles.pop();
  }
  
  // Send server information
  const member = interaction.guild.members.cache;
  const embed = new MessageEmbed()
    .setAuthor(`${guild.name}'s server info`, guild.iconURL())
    .setColor(themeColor)
    .setThumbnail(guild.iconURL())
    .addField("__**Generic**__", `
**Owner:** <@${await guild.fetchOwner().then(m => m.user.id)}> (${await guild.fetchOwner().then(m => m.user.tag)})
**Owner ID:** ${await guild.fetchOwner().then(m => m.user.id)}
**Created:** <t:${moment(guild.createdAt).unix()}:D>
**Server ID:** ${guild.id}
`, false)
    .addField("__**Statistics**__", `
**Max members:** ${guild.maximumMembers}
**Verified:** ${(guild.verified) ? "Yes" : "No"}
**Partnered:** ${(guild.partnered) ? "Yes" : "No"}
**Verification level:** ${guild.verificationLevel}
`, false)
    .addField("__**Members**__", `
**Total Members:** ${guild.memberCount}
**Humans:** ${member.filter(m => !m.user.bot).size.toLocaleString("en-US")}
**Bots:** ${member.filter(m => m.user.bot).size.toLocaleString("en-US")}
**Online:** ${member.filter(m => m.presence?.status === "online").size.toLocaleString("en-US")}
**Idle:** ${member.filter(m => m.presence?.status === "idle").size.toLocaleString("en-US")}
**DND:** ${member.filter(m => m.presence?.status === "dnd").size.toLocaleString("en-US")}
`, false)
    .addField("__**Features**__", `\`${(guild.features.length == 0) ? "None" : guild.features.toString().toLowerCase().replace(/,/g, ", ")}\``, false)
    .addField(`__**Roles (${guild.roles.cache.size})**__`, `${roles.join(", ")}${(roles.length != guild.roles.cache.size) ? "..." : "."}`, false)
    .setTimestamp()
    .setFooter(`Requested by: ${user.tag}`);
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "serverinfo",
  description: "Get information on the server.",
  category: "Server",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};