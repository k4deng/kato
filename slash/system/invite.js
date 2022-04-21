const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const link = client.generateInvite({
		permissions: BigInt(config.invitePerm),
		scopes: ['bot', 'applications.commands'] });

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setLabel('Invite Link')
        .setURL(link)
        .setStyle('LINK'),
    );
  
  const embed = new MessageEmbed()
    .setColor(config.themeColor)
    .setDescription('Click the button below to get a invite link for the bot.');
  
  await interaction.reply({ embeds: [embed], components: [row] });
};

exports.commandData = {
  name: "invite",
  description: "Generate a invite link for the bot.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};