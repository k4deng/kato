const logger = require("./logger.js");
const { MessageEmbed, Permissions } = require('discord.js');

function error(message, interaction, ephemeral = false, returnValue) {
  try {
    const emoji = interaction.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) ? '<:red:813181113056755762>' : ':negative_squared_cross_mark:';
    const embed = new MessageEmbed()
      .setColor(15158332)
      .setDescription(`${emoji} ${message}`);
    if (returnValue) {
      return embed;
    } else {
      if (interaction.replied) 
        return interaction.followUp({ embeds: [embed], ephemeral: ephemeral });
      else 
      if (interaction.deferred)
        return interaction.editReply({ embeds: [embed], ephemeral: ephemeral });
      else 
        return interaction.reply({ embeds: [embed], ephemeral: ephemeral });
    }
  } catch (err) {
    logger.error(err.message);
  }
}

function success(message, interaction, ephemeral = false, returnValue) {
  try {
    const emoji = interaction.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) ? '<:green:813181113010356304>' : ':white_check_mark:';
    const embed = new MessageEmbed()
      .setColor(3066993)
      .setDescription(`${emoji} ${message}`);
    if (returnValue) {
      return embed;
    } else {
      if (interaction.replied) 
        return interaction.followUp({ embeds: [embed], ephemeral: ephemeral });
      else 
      if (interaction.deferred)
        return interaction.editReply({ embeds: [embed], ephemeral: ephemeral });
      else 
        return interaction.reply({ embeds: [embed], ephemeral: ephemeral });
    }
  } catch (err) {
    logger.error(err.message);
  }
}

module.exports = { error, success };