const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const logger = require("../../modules/logger.js");
const messages = require("../../modules/messages.js");
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

  var member = interaction.options.get("user")?.member;
  try {
    const res = await fetch('https://api.yomomma.info');
    let joke = (await res.json()).joke;
    if (member) joke = `${member}, ${joke.charAt(0).toLowerCase() + joke.slice(1)}`;
    if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';
    
    const embed = new MessageEmbed()
      .setDescription(joke)
      .setColor("RANDOM");
    
    await interaction.reply({ embeds: [embed] })
  } catch (err) {
    logger.error(err.stack);
    messages.error("Please try again in a few seconds", interaction, true);
  }
  
};

exports.commandData = {
  name: "yomomma",
  description: "Says a \"yo momma\" joke to a user.",
  options: [{
    name: 'user',
    type: 'USER',
    description: 'Joke reciepient.',
    required: false,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};