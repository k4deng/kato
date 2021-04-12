exports.run = async (client, message, args, level) => {
  const Discord = require('discord.js');

  const embed = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setDescription(`
    _Listed in order of importance, bold items are being currently worked on_

    **URGENT**
      • Moderation Commands
      • Finish dashboard/website

    **NOT SO URGENT**
      • Get used commands to log into a text file for later viewing
      • Add points system
      • Make announcement command to send message in all guilds that the bot is in
      • Add rotating status
      • Add reaction roles
      • Change nickname based on server prefix
      • Add music commands
    `)
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "todo",
  subfolder: "info",
  category: "Info",
  description: "Shows k4dengs to do list for the bot.",
  usage: "todo"
};