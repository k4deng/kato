// This event executes when a new member joins a server. Let's welcome them!

module.exports = (client, member) => {
  // Load the guild's settings
  const settings = client.getSettings(member.guild);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag).replace("{{join}}","<a:join:816009748935344168>");

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  const channel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
  if (!member.guild.channels.cache.get(settings.welcomeChannel)) return channel.send(`Sorry to bother you in this channel, but your welcomeChannel id is wrong! Please check your value with \`${settings.prefix}settings help\`.`);

  member.guild.channels.cache.get(settings.welcomeChannel).send(welcomeMessage).catch(console.error);
};
