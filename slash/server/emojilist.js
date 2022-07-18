exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.reply({ content: `**${interaction.guild.name}'s emoji's:**\n${interaction.guild.emojis.cache.map(e => e.toString()).join(" ")}` });
};

exports.commandData = {
  name: "emojilist",
  description: "Shows all the server's emojis",
  category: "Server",
  options: [],
  dmPermission: false,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};