const { MessageEmbed } = require('discord.js');
const { settings } = require("../../modules/settings.js");
const { points } = require("../../modules/settings.js");
const logger = require("../../modules/logger.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  var option = interaction.options.get("option")?.value; 
  await interaction.reply("Reply?");
};

exports.commandData = {
  name: "name",
  description: "desc",
  options: [{
    name: 'name',
    type: 'STRING',
    description: 'desc',
    required: true,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};