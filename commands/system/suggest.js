exports.run = async (client, message, args, level) => {

const Discord = require('discord.js');

const strings = args.join(' ').split(',');
const title = strings[0];
const desc = strings[1];

const emojiArray = ['813181281265254460','813181280899301458'];
const suggestionsChannel = client.channels.cache.get(client.config.suggestionsChannel);

var embed = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
  .setColor("RANDOM")
  .setTimestamp();
  if (desc) {
    embed.setDescription(`**${title}**\n_${desc}_`);
  } else {
    embed.setDescription(`**${title}**`);
  }

suggestionsChannel.send(embed).then(async (msg) => {
  await msg.react(emojiArray[0]);
  await msg.react(emojiArray[1]);
});

message.success("Your idea has been submitted.");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["suggestion", "idea"],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "suggest",
  subfolder: "system",
  category: "System",
  description: "Adds a suggestion to the the bot's support Discord.",
  usage: "suggest <tite>, [description]"
};