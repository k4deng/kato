const { points } = require("../../modules/settings.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars 
  const filtered = points.filter( p => p.guild === interaction.guild.id ).array();
  const res = filtered.sort((a, b) => b.points - a.points);

  var embed = new MessageEmbed()
    .setTitle("Leaderboard")
    .setColor(config.themeColor);

  var row;
  if (config.dashboard.enabled === "true") {
    const protocol = config.dashboard.secure === "true" ? "https://" : "http://";  
    row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel("Leaderboard Link")
          .setURL(`${protocol}${config.dashboard.domain}/leaderboard/${interaction.guild.id}`)
          .setStyle("LINK"),
      );
  }

  if (!res[0]) {
    // If there no results
    embed.addFields([{ name: "No data found", value: "There are no users on the leaderboard." }]);
  } else {
    for (let j = 0; j < 10; j++) {
      if (res[j]) {
        const name = interaction.guild.members.cache.get(res[j].user) || "User left";
        if (name == "User left") embed.addFields([{ name: `${(j + 1)}. ${name}`, value: `**Points:** ${res[j].points} | **Level:** ${res[j].level}` }]);
        else embed.addFields([{ name: `${(j + 1)}. ${name.user.username}`, value: `**Points:** ${res[j].points} | **Level:** ${res[j].level}` }]);
      }
    }
  }
  if (config.dashboard.enabled === "true") await interaction.reply({ embeds: [embed], components: [row] });
  else await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "leaderboard",
  description: "Shows the top level users in the discord server.",
  category: "Points",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permlevel: "User",
  guildOnly: false
};