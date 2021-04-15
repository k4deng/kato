// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {

  // Dont run in testing serber so that only the development bot works in there
  if (client.guilds.cache.get(message.guild.id).id === "812426728483586079") return;

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  //We do this for embeds.
  const Discord = require("discord.js")

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this server is \`${settings.prefix}\``);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherThing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  //if the command is not enabled dont do anything
  if (cmd.conf.enabled === false)
    return message.error("This command is currently not enabled.");

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.error("This command is unavailable via private message. Please run this command in a server.");

  if (!message.guild) {
    
  } else if (!cmd.conf.botPermissions) {
    // If the bot doesn't have SEND_MESSAGES permissions just return
    if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
      return message.botperms("EMBED_LINKS");
    }
  } else {
    // If the bot doesn't have SEND_MESSAGES permissions just return
    if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
      return message.botperms("EMBED_LINKS");
    }

    //now we go through the rest of the perms listed.
    if (!message.guild){
    
    } else if (!cmd.conf.botPermissions[0]){

    } else if (cmd.conf.botPermissions[0]){
      
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[0])) {
        return message.botperms(cmd.conf.botPermissions[0]);
      }

    } else if (cmd.conf.botPermissions[1]){

      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[0])) {
        message.botperms(cmd.conf.botPermissions[0]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[1])) {
        return message.botperms(cmd.conf.botPermissions[1]);
      }

    } else if (cmd.conf.botPermissions[2]){

      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[0])) {
        message.botperms(cmd.conf.botPermissions[0]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[1])) {
        message.botperms(cmd.conf.botPermissions[1]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[2])) {
        return message.botperms(cmd.conf.botPermissions[2]);
      }

    } else if (cmd.conf.botPermissions[3]){

      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[0])) {
        message.botperms(cmd.conf.botPermissions[0]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[1])) {
        message.botperms(cmd.conf.botPermissions[1]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[2])) {
        message.botperms(cmd.conf.botPermissions[2]);
      }
      if (!message.channel.permissionsFor(client.user).has(cmd.conf.botPermissions[3])) {
        return message.botperms(cmd.conf.botPermissions[3]);
      }

    } else {
      return message.error("Please use 4 or fewer permissions in the botPermissions array.")
    }  
  }

  message.channel.startTyping();

  //send message if user doesnt have the needed permissions
  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.userperms(level, cmd)
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

  cmd.run(client, message, args, level);
  message.channel.stopTyping();
};
