/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const { codeBlock } = require("@discordjs/builders");
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

    // Load guild settings (for prefixes and eventually per-guild tweaks)
    const settings = interaction.settings;
      
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = interaction.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

    // Then we will filter the myCommands collection again to get the enabled commands.
    const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);

    // Here we have to get the command names only, and we use that array to get the longest name.
    const commandNames = [...enabledCommands.keys()];

    // This make the help commands "aligned" in the output.
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n[Use /help <commandname> for details]\n`;
    const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 : 
      p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

    sorted.forEach( c => {
      const cat = toProperCase(c.help.category);
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    interaction.reply(codeBlock("asciidoc", output));




    
  } else {
    // Show individual command's help.
    if (container.commands.has(command) || container.commands.has(container.aliases.get(command))) {
      command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));
      if (level < container.levelCache[command.conf.permLevel]) return;
      interaction.reply(codeBlock("asciidoc", `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}`));
    } else return messages.error("No command with that name exists.", interaction, true);
  }



  
};

exports.commandData = {
  name: "help",
  description: "Shows all your available commands.",
  options: [{
    name: 'command',
    type: 'STRING',
    description: 'Specific command to get help on.',
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