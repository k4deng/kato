// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/logger.js");
// This is your client. Some call it `bot` but, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents, partials });

// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  commands,
  aliases,
  slashcmds,
  levelCache
};

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.
const init = async () => {

  const commandFolders = readdirSync("./commands");
  for (const dir of commandFolders) {
    if (dir == ".gitignore") continue; //not a dir so skip it
    const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of commands) {
      const props = require(`./commands/${dir}/${file}`);
      logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      client.container.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.container.aliases.set(alias, props.help.name);
      });
    }
  }

  const slashFolders = readdirSync("./slash");
  for (const dir of slashFolders) {
    const slashCommands = readdirSync(`./slash/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of slashCommands) {
      const command = require(`./slash/${dir}/${file}`);
      const commandName = file.split(".")[0];
      logger.log(`Loading Slash command: ${commandName}. 👌`);
      // Now set the name of the command with it's properties.
      client.container.slashcmds.set(command.commandData.name, command);
    }
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}. 👌`);
    const event = require(`./events/${file}`);
    // REST rate limited event
    if (eventName == "rateLimited") client.rest.on(eventName, event.bind(null, client));
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }

  // Here we login the client.
  client.login();

// End top-level async/await function.
};

init();
