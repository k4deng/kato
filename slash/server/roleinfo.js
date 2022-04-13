const { MessageEmbed } = require('discord.js');
const { toProperCase } = require("../../modules/functions.js")
const moment = require('moment');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const role = interaction.guild.roles.cache.get(interaction.options.get('role').value);
  
  let permissions;
  if (role.permissions.has('ADMINISTRATOR')) permissions = 'Administrator';
    else permissions = toProperCase(role.permissions.toArray().join(' » ').replace(/[-_]/g, ' ')) || 'None';
  
  const embed = new MessageEmbed()
    .setAuthor(`${role.name} info`)
    .setColor(role.color)
    .addFields(
				{ name: "Role", value: `<@&${role.id}> (${role.id})`, inline: true },
				{ name: "Created on", value: `<t:${moment(role.createdAt).unix()}:f>`, inline: true },
        { name: "Members", value: role.members.size.toLocaleString("en-US"), inline: true },
				{ name: "Position", value: `${role.position} (from bottom)`, inline: true },
        { name: "Managed", value: role.managed ? 'Yes' : 'No', inline: true },
				{ name: "Hoisted", value: role.hoist ? 'Yes' : 'No', inline: true },
				{ name: "Color", value: `\`${role.hexColor}\` (\`${role.color}\`)`, inline: true },
				{ name: "Mentionable", value: role.mentionable ? 'Yes' : 'No', inline: true },
				{ name: "Permissions", value: permissions },
    )
    .setTimestamp()
    .setFooter(`Requested by: ${interaction.user.tag}`);
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "roleinfo",
  description: "Get information on a role.",
  options: [{
    name: 'role',
    type: 'ROLE',
    description: 'The role you want information of',
    required: true,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};