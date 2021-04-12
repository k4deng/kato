exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.error("You need to specify a command to reload, dumbo.");

  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

  const location = command.help.subfolder;
  
  let response = await client.unloadCommand(location, args[0]);
  if (response) return message.error(`Error Unloading: ${response}`);

  response = client.loadCommand(location + "/" + command.help.name);
  if (response) return message.error(`Error Loading: ${response}`);

  message.success(`The command \`${command.help.name}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin",
  botPermissions: []
};

exports.help = {
  name: "reload",
  subfolder: "system",
  category: "System",
  description: "Reloads a command that's been modified.",
  usage: "reload <command>"
};