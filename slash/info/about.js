const { MessageEmbed } = require('discord.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setAuthor('kato', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`)
    .addFields(
      { name: '**What can kato do?**', value: '*If anything is marked as Coming soon!, then it may not be fully complete, and is only planned for the future.*' },
      { name: ':shield: Moderation', value: '*Coming soon!*\nProtect your server with features like revive, editrevive and more!', inline: true },
      { name: '<:purple:813181112754503751> Leveling', value: 'Earn points for talking in your server and brag about all the points you have to your friends!', inline: true },
      { name: ':gear: Automation', value: '*Coming soon!*\nAutomatically do things, like welcome messages, moderation, and polls!', inline: true },
      { name: '\u200B', value: '**More information**\nWant to know more about kato? Keep reading below!' },
      { name: 'About the creator', value: 'kato was made by k4deng to help his discord server. You can find k4deng here: [k4deng.net](https://k4deng.net)', inline: true },
      { name: 'Invite link', value: 'Want to get kato in your server? You can [click here](https://katobot.tk) to invite kato into your server!', inline: true },
      { name: 'kato\'s code', value: 'kato is coded in discord.js using node.js and replit.com. You can find kato\'s code [here](https://github.com/k4deng/kato)', inline: true },
      { name: 'kato Dashboard', value: 'Did you know you can edit your servers settings and more from a website? Well, you can! *Dashboard Website:* [Dashboard](https://katobot.tk)', inline: true },
      { name: 'Support Server', value: 'Need help? Want to see the latest features? Just want to hang out with some fellow kato users? Well do so in the [kato Support Server](https://discord.gg/VERRW3TEUD)', inline: true },
    )
    .setFooter('Bot created by k4deng', 'https://cdn.discordapp.com/avatars/805546498028208190/37194e9d4a7b137294ff134c0cb6fec2.png?size');
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "about",
  description: "Shows some info about the bot.",
  category: "Info",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};