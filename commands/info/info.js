exports.run = async (client, message, args, level) => {
  const Discord = require('discord.js');

  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor('kato', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`)
    .addFields(
      { name: '**What can kato do?**', value: '*If anything is marked as Coming soon!, then it may not be fully complete, and is only planned for the future.*' },
      { name: ':shield: Moderation', value: 'Protect your server with features like revive, editrevive and more!', inline: true },
      { name: '<:purple:813181112754503751> Leveling', value: '*Coming soon!*\nEarn points that sync between all your servers and brag about all the points you have!', inline: true },
      { name: ':gear: Automation', value: 'Automatically do things, like welcome messages, moderation, and polls!', inline: true },
      { name: '\u200B', value: '**More information**\nWant to know more about kato? Do so here!' },
      { name: 'About the creator', value: 'Jirobot was made by k4deng to help his discord server. You can find k4deng here: [k4deng.ml](https://k4deng.ml)', inline: true },
      { name: 'Invite link', value: 'Want to get kato in your server? You can [click here](https://jiro.k4deng.ml/invite) to invite Jirobot into your server!', inline: true },
      { name: 'kato\'s code', value: 'kato is coded in discord.js using node.js and replit.com. You can find kato\'s code [here](https://jiro.k4deng.ml/code)', inline: true },
      { name: 'kato Dashboard', value: 'Did you know you can edit your servers settings and more from a website? Well, you can! *Dashboard Website:* [Dashboard](https://jirobot.k4deng.repl.co)', inline: true },
      { name: 'Support Server', value: 'Need help? Want to see the latest features? Just want to hang out with some fellow kato users? Well do so in the [kato Support Server](https://jiro.k4deng.ml/support)', inline: true },
    )
    .setFooter('Bot created by k4deng', message.author.displayAvatarURL({ dynamic: true }));
    
  message.channel.send(exampleEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["botinfo", "about"],
  permLevel: "User",
  botPermissions: ["USE_EXTERNAL_EMOJIS"]
};

exports.help = {
  name: "info",
  subfolder: "info",
  category: "Info",
  description: "Shows some info about the bot.",
  usage: "info"
};