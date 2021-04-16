exports.run = async (client, message, args, level) => {

  const Discord = require('discord.js');
  const editrevive = client.revivedata.get(`editrevive_${message.channel.id}`);

  if (!editrevive) return message.error('Nothing to Edit Revive');

  const embed = new Discord.MessageEmbed()
    //.setTitle(`${message.channel.name}’s Message`)
    .setAuthor(editrevive.author.tag, editrevive.author.avatarURL)
    .setDescription(editrevive.content)
    .setColor('GREEN')
    .setTimestamp()
    .setFooter('Orignal Message');
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["editsnipe"],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "editrevive",
  subfolder: "moderation",
  category: "Moderation",
  description: "Shows (editrevives) a message that was previously edited.",
  usage: "editrevive"
};