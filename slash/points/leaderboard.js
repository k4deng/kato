const { points } = require("../../modules/settings.js");
const { MessageEmbed } = require('discord.js');
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars 
  await interaction.deferReply();
  const filtered = points.filter( p => p.guild === interaction.guild.id ).array();
  const res = filtered.sort((a, b) => b.points - a.points);

  var embed = new MessageEmbed()
    .setTitle('Leaderboard')
    .setColor(themeColor);

  if (!res[0]) {
    // If there no results
    embed.addField("No data found", "There are no users on the leaderboard.");
  } else {
    for (let j = 0; j < 10; j++) {
      if (res[j]) {
        const name = interaction.guild.members.cache.get(res[j].user) || 'User left';
        if (name == 'User left') embed.addField(`${(j + 1)}. ${name}`, `**Points:** ${res[j].points} | **Level:** ${res[j].level}`);
          else embed.addField(`${(j + 1)}. ${name.user.username}`, `**Points:** ${res[j].points} | **Level:** ${res[j].level}`);
      }
    }
  }
  await interaction.editReply({ embeds: [embed] });
};

exports.commandData = {
  name: "leaderboard",
  description: "Shows the top level users in the discord server.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permlevel: "User",
  guildOnly: false
};