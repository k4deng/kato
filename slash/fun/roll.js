const { EmbedBuilder } = require("discord.js");
const { themeColor } = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const embed = new EmbedBuilder()
    .setColor(themeColor)
    .setTitle("Result:");

  const number = Math.floor(Math.random() * 6);
  const images =
    ["https://cdn.discordapp.com/attachments/969301458363240458/969301715918675968/dieWhite_border1.png",
      "https://cdn.discordapp.com/attachments/969301458363240458/969301715574722590/dieWhite_border2.png",
      "https://cdn.discordapp.com/attachments/969301458363240458/969301714807193650/dieWhite_border3.png",
      "https://cdn.discordapp.com/attachments/969301458363240458/969301714358386718/dieWhite_border4.png",
      "https://cdn.discordapp.com/attachments/969301458363240458/969301714060599386/dieWhite_border5.png",
      "https://cdn.discordapp.com/attachments/969301458363240458/969301716417802351/dieWhite_border6.png"];
  embed.setImage(images[number]);
  
  await interaction.reply({ embeds: [ embed ] });
};

exports.commandData = {
  name: "roll",
  description: "Roll a 6 sided dice.",
  category: "Fun",
  options: [],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};