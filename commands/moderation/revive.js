exports.run = async (client, message, args, level) => {

  const Discord = require('discord.js');
  const revive = client.revivedata.get(`revive_${message.channel.id}`);

  if (!revive) return message.channel.send('Nothing to Revive')

  const embed = new Discord.MessageEmbed()
    //.setTitle(`${message.channel.name}’s Message`)
    .setAuthor(revive.author.tag, revive.author.avatarURL)
    .setDescription(revive.content)
    .setColor('GREEN')
    .setTimestamp()
    .setFooter('Revived Message');
  message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["snipe"],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "revive",
  subfolder: "moderation",
  category: "Moderation",
  description: "Shows (revives) a message that was deleted.",
  usage: "revive"
};