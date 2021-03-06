// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS
const { ApplicationCommandOptionType, codeBlock } = require("discord.js");
const { splitMessage } = require("../../modules/functions.js");

/*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
*/
async function clean(client, text) {
  if (text && text.constructor.name == "Promise")
    text = await text;
  if (typeof text !== "string")
    text = require("util").inspect(text, {depth: 1});

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  text = text.replaceAll(client.token, "[REDACTED]");

  return text;
}

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const code = interaction.options.get("code")?.value; 
  const evaled = eval(code);
  const cleaned = await clean(client, evaled);
  const text = splitMessage(cleaned, { maxLength: "1900" });
  
  for (const split of text) {
    if (interaction.replied) await interaction.followUp({ content: codeBlock("js", split) });
    else await interaction.reply({ content: codeBlock("js", split) });
  }
};

exports.commandData = {
  name: "eval",
  description: "Evaluates arbitrary javascript.",
  category: "System",
  options: [{
    name: "code",
    type: ApplicationCommandOptionType.String,
    description: "Code to Evaluate.",
    required: true,   
  }],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "Bot Owner"
};