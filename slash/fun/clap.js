const { ApplicationCommandOptionType } = require("discord.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

  var message = interaction.options.get("message")?.value; 
  var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
  var clap;
  if (regexp.test(message)) {
    clap = message.split(" ").join(" :clap: ");
    if (clap.length > 1990) messages.error("That clap is too long!", interaction, true);
    clap = `👏 ${clap} 👏`;
  } else {
    clap = message.split(" ").slice(0).join("").split("").join(" :clap: ");
    if (clap.length < 2) return messages.error("I need more than 2 characters!", interaction, true);
    if (clap.length > 1990) return messages.error("That clap is too long!", interaction, true);
  }

  await interaction.reply({ content: clap });
  
};

exports.commandData = {
  name: "clap",
  description: "👏 Clap 👏",
  category: "Fun",
  options: [{
    name: "message",
    type: ApplicationCommandOptionType.String,
    description: "Message to clap-ify.",
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