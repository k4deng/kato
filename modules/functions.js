const logger = require("./logger.js");
const config = require("../config.js");
const { settings, points } = require("./settings.js");
// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.

/*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!
  */
function permlevel(message) {
  let permlvl = 0;

  const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/*
  GUILD SETTINGS FUNCTION
  This function merges the default settings (from config.defaultSettings) with any
  guild override you might have for particular guild. If no overrides are present,
  the default settings are used.
*/
  
// getSettings merges the client defaults with the guild settings. guild settings in
// enmap should only have *unique* overrides that are different from defaults.
function getSettings(guild) {
  settings.ensure("default", config.defaultSettings);
  if (!guild) return settings.get("default");
  const guildConf = settings.get(guild.id) || {};
  // This "..." thing is the "Spread Operator". It's awesome!
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  return ({...settings.get("default"), ...guildConf});
}

// same but with points
function getPoints(user, guild) {
  points.ensure(`${guild.id}-${user.id}`, {
    guild: guild.id,
    user: user.id,
    points: 0,
    level: 0
  });
  const userPoints = points.get(`${guild.id}-${user.id}`) || {};

  return ({...userPoints});
}

/*
  SINGLE-LINE AWAIT MESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
*/
async function awaitReply(msg, question, limit = 60000) {
  const filter = msg.author ? m => m.author.id === msg.author.id : m => m.author.id === msg.user.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}

async function awaitButton(interaction, id, limit = 60000) {
  const filter = i => (i.customId === id && i.user.id === interaction.user.id);
  try {
    const collected = await interaction.channel.awaitMessageComponent({ filter, time: limit })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    return collected;
  } catch (e) {
    return false;
  }
}

async function awaitModal(interaction, id, limit = 60000) {
  const filter = i => (i.customId === id && i.user.id === interaction.user.id);
  try {
    const collected = await interaction.awaitModalSubmit({ filter, time: limit });
    return collected;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// toProperCase(String) returns a proper-cased string such as: 
// toProperCase("Mary had a little lamb") returns "Mary Had A Little Lamb"
function toProperCase(string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// From discord.js v13 -- Was deprecated
function splitMessage(text, { maxLength = 2_000, char = "\n", prepend = "", append = "" } = {}) {
  if (text.length <= maxLength) return [text];
  let splitText = [text];
  if (Array.isArray(char)) {
    while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
      const currentChar = char.shift();
      if (currentChar instanceof RegExp) {
        splitText = splitText.flatMap(chunk => chunk.match(currentChar));
      } else {
        splitText = splitText.flatMap(chunk => chunk.split(currentChar));
      }
    }
  } else {
    splitText = text.split(char);
  }
  if (splitText.some(elem => elem.length > maxLength)) throw new RangeError("SPLIT_MAX_LEN");
  const messages = [];
  let msg = "";
  for (const chunk of splitText) {
    if (msg && (msg + char + chunk + append).length > maxLength) {
      messages.push(msg + append);
      msg = prepend;
    }
    msg += (msg && msg !== prepend ? char : "") + chunk;
  }
  return messages.concat(msg).filter(m => m);
}

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled rejection: ${err}`);
  console.error(err);
});

module.exports = { getSettings, getPoints, permlevel, awaitReply, awaitButton, awaitModal, toProperCase, splitMessage };