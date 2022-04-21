const messages = require("../../modules/messages.js");
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.reply( Math.round(Math.random()) > 0.5 ? 'Its Heads!' : 'Its Tails!' );  
};

exports.commandData = {
  name: "flip",
  description: "Flips a coin.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};