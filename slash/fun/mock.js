exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const text = interaction.options.get("text").value; 
  
  const mock = text.toLowerCase().split("").map(c => Math.random() < 0.5 ? c : c.toUpperCase()).join("");

  await interaction.reply(mock);
};

exports.commandData = {
  name: "mock",
  description: "Makes your text mocking.",
  category: "Fun",
  options: [{
    name: "text",
    type: "STRING",
    description: "Text for mock.",
    required: true
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};