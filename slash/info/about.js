const { EmbedBuilder } = require("discord.js");
const config = require("../../config.js");
const protocol = config.dashboard.secure === "true" ? "https://" : "http://";

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setAuthor({ name: client.user.username , iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128` })
    .addFields(
      {
        name: `**What can ${client.user.username} do?**`,
        value: "\u200B"
      },
      {
        name: ":shield: Moderation",
        value: "Protect your server with commands like slowmode, nickname and more!",
        inline: true
      },
      {
        name: "<:purple:813181112754503751> Leveling",
        value: "Earn points for talking in your server and brag about all the points you have to your friends!",
        inline: true
      },
      {
        name: ":wave: Welcoming",
        value: "Welcome users to your server with a customizable message and be sure every user gets a welcomed.",
        inline: true
      },
      {
        name: "\u200B",
        value: `**More information**\nWant to know more about ${client.user.username}? Keep reading below!` },
      {
        name: "About the creator",
        value: `${client.user.username} was originally made by k4deng to help his discord server. You can find k4deng at [l.kk4deng.net](https://l.k4deng.net)`,
        inline: true
      },
      {
        name: "Invite link",
        value: `Want to get ${client.user.username} in your server? You can [click here](${protocol}${config.dashboard.domain}/invite) to invite ${client.user.username} into your server!`, 
        inline: true
      },
      {
        name: `${client.user.username}'s code`,
        value: `${client.user.username} is coded in discord.js using node.js. You can find ${client.user.username}'s code [here](https://github.com/k4deng/kato)`,
        inline: true
      },
      {
        name: `${client.user.username} Dashboard`,
        value: `Did you know you can edit your servers settings and more from a website? Well, you can! *Dashboard Website:* [Dashboard](${protocol}${config.dashboard.domain})`,
        inline: true
      },
      {
        name: "Support Server",
        value: `Need help? Want to see the latest features? Just want to hang out with some fellow ${client.user.username} users? Well you can in the [${client.user.username} Support Server](${protocol}${config.dashboard.domain}/support)`,
        inline: true
      },
    )
    .setFooter({ text: "Bot created by k4deng" , iconURL: "https://k4deng.net/pfp.jpg" });
  
  await interaction.reply({ embeds: [embed] });
};

exports.commandData = {
  name: "about",
  description: "Shows some info about the bot.",
  category: "Info",
  options: [],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};