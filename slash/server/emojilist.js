exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.reply(`**${interaction.guild.name}'s emoji's:**\n${interaction.guild.emojis.cache.map(e => e.toString()).join(' ')}`);
};

exports.commandData = {
  name: "emojilist",
  description: "Shows all the server's emojis",
  category: "Server",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};