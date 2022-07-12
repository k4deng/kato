const { permlevel } = require("../../modules/functions.js");
const config = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  
  var level = permlevel(interaction);
  const friendly = config.permLevels.find(l => l.level === level).name;
  await interaction.reply({ content: `Your permission level is: ${level} - ${friendly}` });
  
};

exports.commandData = {
  name: "mylevel",
  description: "Tells you your permission level for the current message location.",
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