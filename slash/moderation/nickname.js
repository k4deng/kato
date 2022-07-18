const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return messages.error("I am missing the \"Manage Nicknames\" permission to do that!", interaction);

  const member = interaction.guild.members.cache.get(interaction.options.get("user")?.value ?? interaction.user.id);
  const nickname = interaction.options.get("nickname").value;
  
  if (member.permissions.has(PermissionsBitField.Flags.Administrator) || (member.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) > 0)) {
    return messages.error("I am unable to change that user's nickname due to their power.", interaction);
  }

  if (nickname.length >= 32) return messages.error("Nickname must be shorter than 32 characters.", interaction);

  await member.setNickname(nickname);
  messages.success(`**Successfully changed nickname of <@${member.user.id}>.**`, interaction);
};

exports.commandData = {
  name: "nickname",
  description: "Change a users nickname.",
  category: "Moderation",
  options: [{
    name: "nickname",
    type: ApplicationCommandOptionType.String,
    description: "Nickname to give user.",
    required: true,   
  },
  {
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "User to change nickname of.",
    required: false,   
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Moderator",
  guildOnly: false
};