const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const link = client.generateInvite({
    permissions: BigInt(config.invitePerm),
    scopes: ["bot", "applications.commands"] });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel("Invite Link")
        .setURL(link)
        .setStyle(ButtonStyle.Link),
    );
  
  const embed = new EmbedBuilder()
    .setColor(config.themeColor)
    .setDescription("Click the button below to get a invite link for the bot.");
  
  await interaction.reply({ embeds: [embed], components: [row] });
};

exports.commandData = {
  name: "invite",
  description: "Generate a invite link for the bot.",
  category: "System",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};