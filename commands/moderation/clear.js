exports.run = async (client, message, args, level) => {

  const Discord = require('discord.js');

  let newamount = 0;
  if (!args[0]) {
    newamount = 2;
  } else {
    var amount = Number(args[0]);
    var adding = 1;
    newamount = amount + adding;
  }
  const messagecount = newamount.toString();

  if (messagecount > 100) {
    message.delete();
    return message.error("Due to Discord limits, you cannot delete more than 100 messages. Please try again with a number less than 100").then(message => message.del(5000));
  }

  message.channel
    .messages.fetch({ limit: messagecount })
    .then(messages => {
      message.channel.bulkDelete(messages);
      // Logging the number of messages deleted on both the channel and console.

      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`<:yea:813181281265254460> Deletion of messages successful!`)
        .setDescription(`Total messages deleted including command: **${newamount}**`);
      message.channel.send(embed).then(message => message.del(5000));
    })
    .catch(err => {
      console.log('Error while doing Bulk Delete');
      console.log(err);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["purge"],
  permLevel: "Moderator",
  botPermissions: ["MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS"]
};

exports.help = {
  name: "clear",
  subfolder: "moderation",
  category: "Moderation",
  description: "Clears a set amount of messages.",
  usage: "clear [amount to clear]"
};