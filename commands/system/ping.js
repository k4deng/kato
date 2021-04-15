exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("If you see this it's time to overthrow the USA government");
  msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  botPermissions: []
};

exports.help = {
  name: "ping",
  subfolder: "system",
  category: "System",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
