/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const { ApplicationCommandOptionType, codeBlock } = require("discord.js");
const { toProperCase, permlevel } = require("../../modules/functions.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // Give us our command/args
  var command = interaction.options.get("command")?.value; 
  // Get user level
  var level = permlevel(interaction);
  // Grab the container from the client to reduce line length.
  const { container } = client;
  
  // If no specific command is called, show all filtered commands.
  if (!command) {
      
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = interaction.guild ? container.slashcmds.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      container.slashcmds.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

    // Here we have to get the command names only, and we use that array to get the longest name.
    const commandNames = [...myCommands.keys()];

    // This make the help commands "aligned" in the output.
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = "= Command List =\n[Use /help <commandname> for details]\n";
    const sorted = myCommands.sort((p, c) => p.commandData.category > c.commandData.category ? 1 : 
      p.commandData.name > c.commandData.name && p.commandData.category === c.commandData.category ? 1 : -1 );

    sorted.forEach( c => {
      const cat = toProperCase(c.commandData.category);
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `/${c.commandData.name}${" ".repeat(longest - c.commandData.name.length)} :: ${c.commandData.description}\n`;
    });
    interaction.reply({ content: codeBlock("asciidoc", output) });
  } else {
    // Show individual command's help.
    if (container.slashcmds.has(command)) {
      command = container.slashcmds.get(command);
      //if (level < container.levelCache[command.conf.permLevel]) return messages.error("No command with that name exists.", interaction);
      interaction.reply({ content: codeBlock("asciidoc", `= ${toProperCase(command.commandData.name)} = \n${command.commandData.description}\nPerm Level Needed :: ${command.conf.permLevel}`) });
    } else return messages.error("No command with that name exists.", interaction);
  }
};

exports.commandData = {
  name: "help",
  description: "Shows all your available commands.",
  category: "Info",
  options: [{
    name: "command",
    type: ApplicationCommandOptionType.String,
    description: "Specific command to get help on.",
    required: false,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};