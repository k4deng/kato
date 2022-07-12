/* eslint-disable */
// ==========================================================
// ================= Slash Command Example ==================
// ==========================================================

const { MessageEmbed } = require("discord.js");
const { settings } = require("../../modules/settings.js");
const { points } = require("../../modules/settings.js");
const config = require("../../config.js");
const logger = require("../../modules/logger.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  var option = interaction.options.get("option")?.value; 
  await interaction.reply("Reply?");
};

exports.commandData = {
  name: "name",
  description: "desc",
  category: "Category",
  options: [{
    name: "name",
    type: "STRING",
    description: "desc",
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

// ==========================================================
// ================== Context Menu Example ==================
// ==========================================================
// DONT USE THO UNTIL FIX FOR LACK OF DESCRIPTION IS AVAILABLE 
// reutrns a message or user object by using `interaction.channel.messages.fetch(interaction.targetId);`

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const msg = await interaction.channel.messages.fetch(interaction.targetId);
  interaction.reply(`${msg.author.tag}: ${msg.content}`)
};

exports.commandData = {
  name: "messageinfo",
  type: "MESSAGE", // use "USER" for user context menu command
  category: "Category",
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};