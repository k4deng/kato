const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  var subfolder = interaction.options.get("subfolder")?.value; 
  var commandArg = interaction.options.get("command")?.value; 

  // Grab the container from the client to reduce line length.
  const { container } = client;

  var command = container.slashcmds.get(commandArg) || container.slashcmds.get(container.aliases.get(commandArg));
  // Check if the command exists and is valid
  if (!command) {
    return messages.error("That command does not exist", interaction);
  }
  // the path is relative to the *current folder*, so just ../subfolder/filename.js
  delete require.cache[require.resolve(`../${subfolder}/${command.commandData.name}.js`)];
  // We also need to delete and reload the command from the container.slashcmds Enmap
  container.slashcmds.delete(command.commandData.name);
  const props = require(`../${subfolder}/${command.commandData.name}.js`);
  container.slashcmds.set(command.commandData.name, props);

  await messages.success(`The command \`${command.commandData.name}\` has been reloaded`, interaction);
};

exports.commandData = {
  name: "reload",
  description: "Reloads a command that\"s been modified.",
  category: "System",
  options: [{
    name: 'subfolder',
    type: 'STRING',
    description: 'Subfolder to search in.',
    required: true,   
  },
  {
    name: 'command',
    type: 'STRING',
    description: 'Command to reload.',
    required: true,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Bot Admin",
  guildOnly: false
};