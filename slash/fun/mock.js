const { ApplicationCommandOptionType } = require("discord.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const text = interaction.options.get("text").value; 
  const mock = text.toLowerCase().split("").map(c => Math.random() < 0.5 ? c : c.toUpperCase()).join("");
  await interaction.reply({ content: mock });
};

exports.commandData = {
  name: "mock",
  description: "Makes your text mocking.",
  category: "Fun",
  options: [{
    name: "text",
    type: ApplicationCommandOptionType.String,
    description: "Text for mock.",
    required: true
  }],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};