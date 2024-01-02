const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const moment = require("moment");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const role = interaction.guild.roles.cache.get(interaction.options.get("role").value);
  
  let permissions;
  if (role.permissions.has(PermissionsBitField.Flags.Administrator)) {
    permissions = "Administrator";
  } else { 
    const allPerms = role.permissions.toArray();
    const newPerms = [];
    for (const perm of allPerms) {
      const splitPerm = perm.split(/([A-Z][a-z]+)/).join(" ");
      newPerms.push(splitPerm);
    }
    permissions = newPerms.join(" **»** ") || "None";
  }
  
  const embed = new EmbedBuilder()
    .setAuthor({ name: `${role.name} info` })
    .setColor(role.color)
    .addFields(
      { name: "Role", value: `<@&${role.id}> (${role.id})`, inline: true },
      { name: "Created on", value: `<t:${moment(role.createdAt).unix()}:f>`, inline: true },
      { name: "Members", value: role.members.size.toLocaleString("en-US"), inline: true },
      { name: "Position", value: `${role.position} (from bottom)`, inline: true },
      { name: "Managed", value: role.managed ? "Yes" : "No", inline: true },
      { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
      { name: "Color", value: `\`${role.hexColor}\` (\`${role.color}\`)`, inline: true },
      { name: "Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
      { name: "Permissions", value: `${permissions}` },
    )
    .setTimestamp()
    .setFooter({ text: `Requested by: ${interaction.user.username}` });
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "roleinfo",
  description: "Get information on a role.",
  category: "Server",
  options: [{
    name: "role",
    type: ApplicationCommandOptionType.Role,
    description: "The role you want information of",
    required: true,   
  }],
  dmPermission: false,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};