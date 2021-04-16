exports.run = async (client, message, args, level) => {
  const Discord = require('discord.js');

  if ( message.guild.id === '805925723688009748' || message.guild.id === '795774938589954059' ) {
    const embed = new Discord.MessageEmbed()
      .setColor(0x3bd862)
      .addField(`<:minecraft:812110264795136050> Minecraft Server Map`, `http://${process.env.SERVERIP}:8123`);
    message.channel.send(embed);
  } else {
    message.error("You cant use this command in this server!");
  }
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: ['map', 'minecraftmap'],
  permLevel: "User",
  botPermissions: ["USE_EXTERNAL_EMOJIS"]
};

exports.help = {
  name: "mcmap",
  subfolder: "guildspecific",
  category: "Info",
  description: "Shows the world map of k4deng's minecraft server.",
  usage: "mcmap"
};
