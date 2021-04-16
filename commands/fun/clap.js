exports.run = async (client, message, args, level) => {

  var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
  if (regexp.test(args.join(" "))) {
    let clap = args.join(' :clap: ');
    if (clap.length > 1990) return message.error("That clap is too long!");
    message.channel.send(`👏 ${clap} 👏`);
    message.del();
  } else {
    let clap = args.slice(0).join('').split('').join(' :clap: ');
    if (clap.length < 2) return message.error("I need more than 2 characters!");
    if (clap.length > 1990) return message.error("That clap is too long!");
    message.channel.send(`${clap}`);
    message.del();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["handclap"],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "clap",
  subfolder: "fun",
  category: "Fun",
  description: "C👏L👏A👏P",
  usage: "clap <phrase>"
};
