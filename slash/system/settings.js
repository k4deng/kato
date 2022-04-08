// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with you
const { codeBlock } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require('discord.js');
const { settings } = require("../../modules/settings.js");
const { awaitButton } = require("../../modules/functions.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  
  var action = interaction.options.getSubcommand(); 
  var key = interaction.options.getString("key"); 
  var value = interaction.options.get("value")?.value; 
  
  // Retrieve current guild settings (merged) and overrides only.
  const serverSettings = interaction.settings;
  const defaults = settings.get("default");
  const overrides = settings.get(interaction.guild.id);
  if (!settings.has(interaction.guild.id)) settings.set(interaction.guild.id, {});

  await interaction.deferReply();

  // Edit an existing key value
  if (action === "edit") {  
    // User must specify a key that actually exists!
    if (!defaults[key]) return messages.error("This key does not exist in the settings", interaction);
    const joinedValue = value;
    // User must specify a value to change.
    if (joinedValue.length < 1) return messages.error("Please specify a new value", interaction);
    // User must specify a different value than the current one.
    if (joinedValue === serverSettings[key]) return messages.error("This setting already has that value!", interaction);
    
    // If the guild does not have any overrides, initialize it.
    if (!settings.has(interaction.guild.id)) settings.set(interaction.guild.id, {});

    // Modify the guild overrides directly.
    settings.set(interaction.guild.id, joinedValue, key);

    // Confirm everything is fine!
    messages.success(`\`${key}\` successfully edited to \`${joinedValue}\``, interaction);
  } else

  // Resets a key to the default value
  if (action === "reset") { 
    if (!defaults[key]) return await messages.error("This key does not exist in the settings", interaction);
    if (!overrides[key]) return await messages.error("This key does not have an override and is already using defaults.", interaction);

    const confButton = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('confButton')
					.setLabel('Confirm')
					.setStyle('DANGER'),
			);
    await interaction.editReply({ content: `Please confirm to reset \`${key}\` to defualt.`, components: [confButton] });

    // Good demonstration of the custom awaitButton method in `./modules/functions.js` !
    const conf = await awaitButton(interaction, "confButton", 10000);
    
    if (conf == true) {
      // We delete the `key` here.
      settings.delete(interaction.guild.id, key);
      var embed = messages.success(`\`${key}\` was successfully reset to default.`, interaction, false, true);
      await interaction.editReply({ embeds: [embed], content: " ", components: [] });
    } else if (conf == false) {
      // They did not click the button so we cancel.
      var embed = messages.error(`Your setting for \`${key}\` remains at \`${serverSettings[key]}\``, interaction, false, true);
      await interaction.editReply({ embeds: [embed], content: " ", components: [] });
    }
  } else
    
  if (action === "view") {
    if (!defaults[key]) return messages.error("This key does not exist in the settings", interaction);
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    messages.success(`The value of \`${key}\` is currently \`${serverSettings[key]}\`${isDefault}`, interaction);
  } else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(serverSettings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
    });
    await interaction.reply(codeBlock("asciidoc", `= Current Guild Settings =
${array.join("\n")}`));    
  }
};

exports.commandData = {
  name: "settings",
  description: "View or change settings for your server.",
  options: [{
    name: 'view',
    type: 'SUB_COMMAND',
    description: 'View a server setting.',
    options: [{
      name: 'key',
      type: 'STRING',
      description: 'desc',
      required: true,
    }],
  },
  {
    name: 'edit',
    type: 'SUB_COMMAND',
    description: 'Edit a server setting.',
    options: [{
      name: 'key',
      type: 'STRING',
      description: 'desc',
      required: true,
    },
    {
      name: 'value',
      type: 'STRING',
      description: 'desc',
      required: true,
    }],
  },
  {
    name: 'reset',
    type: 'SUB_COMMAND',
    description: 'Reset a server setting to the defualt.',
    options: [{
      name: 'key',
      type: 'STRING',
      description: 'desc',
      required: true,
    }],
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Administrator",
  guildOnly: false
};