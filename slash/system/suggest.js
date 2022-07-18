const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { success } = require("../../modules/messages.js");
const config = require("../../config.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

  var title = interaction.options.get("title")?.value; 
  var desc = interaction.options.get("description")?.value; 
  var emojiArray = ["813181281265254460","813181280899301458"];
  var suggestionsChannel = client.channels.cache.get(config.suggestionsChannel);
  
  var embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor("Random")
    .setTimestamp();
  if (desc) embed.setDescription(`**${title}**\n_${desc}_`);
  else embed.setDescription(`**${title}**`);

  suggestionsChannel.send({ embeds: [embed] }).then(async (msg) => {
    await msg.react(emojiArray[0]);
    await msg.react(emojiArray[1]);
  });

  await interaction.reply({ embeds: [success("Your idea has been submitted.", interaction, true, true)] });
};

exports.commandData = {
  name: "suggest",
  description: "Adds a suggestion to the the bot's support Discord server.",
  category: "System",
  options: [{
    name: "title",
    type: ApplicationCommandOptionType.String,
    description: "Title of your suggestion.",
    required: true,   
  },
  {
    name: "description",
    type: ApplicationCommandOptionType.String,
    description: "Description for more information about your suggestion.",
    required: false,   
  }],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};