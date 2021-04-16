exports.run = async (client, message, args, level) => {
  const fetch = require('node-fetch');
  const Discord = require('discord.js');

  const member =  message.mentions.users.first() ? message.mentions.users.first() : message.author.username;
  try {
    const res = await fetch('https://api.yomomma.info');
    let joke = (await res.json()).joke;
    joke = joke.charAt(0).toLowerCase() + joke.slice(1);
    if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';
    const embed = new Discord.MessageEmbed()
      .setTitle('Yo Momma')
      .setDescription(`${member}, ${joke}`)
      .setFooter(message.author.username,  message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RANDOM");
    message.channel.send(embed);
  } catch (err) {
    message.client.logger.error(err.stack);
    message.error(message, 1, 'Please try again in a few seconds', err.message);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yomama'],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "yomamma",
  subfolder: "fun",
  category: "Fun",
  description: "Says a random \"yo momma\" joke to the specified user.",
  usage: "yomamma <@mention>"
};