exports.run = async (client, message, args, level) => {

  if (!args[0]) {
    message.channel.send(`**${message.guild.name}'s emoji's:**\n${message.guild.emojis.cache.map(e => e.toString()).join(' ')}`);
  } else {
    const guild = client.guilds.cache.get(args[0]);
    message.channel.send(`**${guild.name}'s emoji's:**\n${guild.emojis.cache.map(e => e.toString()).join(' ')}`);
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["emojis"],
  permLevel: "User",
  botPermissions: ["USE_EXTERNAL_EMOJIS"]
};

exports.help = {
  name: "emojilist",
  subfolder: "info",
  category: "Info",
  description: "Shows all the emojis from a guild.",
  usage: "emojilist <guild id>"
};