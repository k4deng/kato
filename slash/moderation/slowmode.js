const { ApplicationCommandOptionType } = require("discord.js");
const messages = require("../../modules/messages.js");
const { getTotalTime, getReadableTime } = require("../../modules/timeFormatter.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const input = interaction.options.get("time").value; 
  const channel = interaction.guild.channels.cache.get(interaction.channelId);

  // get time
  let time;
  if (input == "off") {
    time = 0;
  } else if (input) {
    const { error, success } = getTotalTime(interaction.options.get("time").value);
    if (success && success > 21600000) return messages.error("Time must be at most 6 hours.", interaction);
    if (error) return messages.error(error, interaction);
    time = success;
  }
  
  // Activate slowmode
  await channel.setRateLimitPerUser(time / 1000);
  messages.success(`Slowmode set to **${time == 0 ? "off" : getReadableTime(time)}**.`, interaction);
};

exports.commandData = {
  name: "slowmode",
  description: "Activate slowmode on a channel.",
  category: "Moderation",
  options: [{
    name: "time",
    type: ApplicationCommandOptionType.String,
    description: "How long for slowmode (\"off\" to disable)",
    required: true,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Moderator",
  guildOnly: false
};