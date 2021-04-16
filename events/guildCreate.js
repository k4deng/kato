// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);


    const Discord = require("discord.js");
    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    const embed = new Discord.MessageEmbed()
      .setTitle(`Thanks for adding me to your server! <a\:join:816009748935344168>`)
      .setColor("GREEN")
      .setDescription(`
<a\:yellowstar:816009746192531486>Hi there, I'm JiroBot, the all in one Discord bot for all your needs. JiroBot utilizes many discord features to enhance your server with stuff like bulk message clearing, deleted message viewing, and much, much, more!

<a\:purplestar:816009745928421477>To get started, do \`${client.settings.get("default").prefix}settings help\` to see info about each setting and \`${client.settings.get("default").prefix}settings edit <key> <value>\` to edit the default settings you want.

<a\:redstar:816009745848336384>**Aaanndd thats it! You're done now! Do \`${client.settings.get("default").prefix}help\` to see all my commands.**
`)
      .addField(`Bot Website`, `[jiro.k4deng.ml](https://jiro.k4deng.ml)`, true)
      .addField(`Bot Code`, `[jiro.k4deng.ml/code](https://jiro.k4deng.ml/code)`, true)
      .addField(`Support Server`, `[jiro.k4deng.ml/support](https://jiro.k4deng.ml/support)`, true)
      .setFooter(`Created and Coded by k4deng`, `https://k4deng.ml/pfp.jpg`);
      channel.send(embed);

};
