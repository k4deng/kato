const fetch = require("node-fetch");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const logger = require("../../modules/logger.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const member = interaction.options.get("user")?.member;
  
  try {
    const res = await fetch("https://api.yomomma.info");
    let joke = (await res.json()).joke;
    if (member) joke = `${member}, ${joke.charAt(0).toLowerCase() + joke.slice(1)}`;
    if (!joke.endsWith("!") && !joke.endsWith(".") && !joke.endsWith("\"")) joke += "!";
    
    const embed = new EmbedBuilder()
      .setDescription(joke)
      .setColor("Random");
    
    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    logger.error(err.stack);
    messages.error("Please try again in a few seconds", interaction, true);
  }
};

exports.commandData = {
  name: "yomomma",
  description: "Says a \"yo momma\" joke to a user.",
  category: "Fun",
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "Joke reciepient.",
    required: false,   
  }],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};