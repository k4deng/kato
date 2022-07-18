// owner & admin commands for stuff
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } = require("discord.js");
const { settings } = require("../../modules/settings.js");
const { awaitButton } = require("../../modules/functions.js");
const messages = require("../../modules/messages.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

  var group = interaction.options.getSubcommandGroup(false);
  var subcommand = interaction.options.getSubcommand(); 

  // Conf Command
  if (group === "conf") {
    var action = subcommand;
    var key = interaction.options.get("key")?.value; 
    var value = interaction.options.get("value")?.value; 
    
    // Retrieve Default Values from the default settings in the bot.
    const defaults = settings.get("default");
  
    await interaction.deferReply();
  
    // Adding a new key adds it to every guild (it will be visible to all of them)
    if (action === "add") {
      if (defaults[key]) return messages.error("This key already exists in the default settings", interaction);
  
      // `value` being an array, we need to join it first.
      defaults[key] = value;
    
      // One the settings is modified, we write it back to the collection
      settings.set("default", defaults);
      messages.success(`\`${key}\` successfully added with the value of \`${value}\``, interaction);
    } else

    // Changing the default value of a key only modified it for guilds that did not change it to another value.
    if (action === "edit") {
      if (!defaults[key]) return messages.error("This key does not exist in the settings", interaction);
      if (value.length < 1) return messages.error("Please specify a new value", interaction);
  
      defaults[key] = value;
      settings.set("default", defaults);
  
      messages.success(`\`${key}\` successfully edited to \`${value}\``, interaction);
    } else

    // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
    // MAKE SURE THAT KEY IS REALLY NO LONGER NEEDED!
    if (action === "delete") { 

      if (!defaults[key]) return await messages.error("This key does not exist in the settings", interaction);

      const confButton2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("confButton2")
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Danger),
        );
      await interaction.editReply({ content: `Are you sure you want to permanently delete \`${key}\` from all guilds? This **CANNOT** be undone.`, components: [confButton2] });

      const confirm = await awaitButton(interaction, "confButton2", 10000);
  
      if (confirm == true) {
        // We delete the default `key` here.
        delete defaults[key];
        settings.set("default", defaults);
        
        // then we loop on all the guilds and remove this key if it exists.
        // "if it exists" is done with the filter (if the key is present and it's not the default config!)
        for (const [guildId, conf] of settings.filter((setting, id) => setting[key] && id !== "default")) {
          delete conf[key];
          settings.set(guildId, conf);
        }
        
        var embed = messages.success(`\`${key}\` was successfully deleted.`, interaction, false, true);
        await interaction.editReply({ embeds: [embed], content: " ", components: [] });
      } else if (confirm == false) {
        // They did not click the button so we cancel.
        var embed2 = messages.error(`Deletion of \`${key}\` was cancelled.`, interaction, false, true);
        await interaction.editReply({ embeds: [embed2], content: " ", components: [] });
      }
    } else

    // Display a key's default value
    if (action === "view") {
      if (key) {
        if (!defaults[key]) return messages.error("This key does not exist in the settings", interaction);
        messages.success(`The value of \`${key}\` is currently \`${defaults[key]}\``, interaction);  
      } else {
        // Otherwise, the default action is to return the whole configuration;
        const array = [];
        Object.entries(settings.get("default")).forEach(([key, value]) => {
          array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
        });
        await interaction.editReply({ content: codeBlock("asciidoc", `= Bot Default Settings =
    ${array.join("\n")}`) });
      }
    } 
  } else
    
  if (subcommand === "deploy") {
    // We'll partition the slash commands based on the guildOnly boolean.
    // Separating them into the correct objects defined in the array below.
    const [globalCmds, guildCmds] = client.container.slashcmds.partition(c => !c.conf.guildOnly);
  
    // Give the user a notification the commands are deploying.
    messages.loading("Deploying commands", interaction);
  
    // We'll use set but please keep in mind that `set` is overkill for a singular command.
    // Set the guild commands like 
    await client.guilds.cache.get(interaction.guild.id)?.commands.set(guildCmds.map(c => c.commandData));
  
    // Then set the global commands like 
    await client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));
  
    // Reply to the user that the commands have been deployed.
    await interaction.editReply({ embeds: [messages.success("All commands deployed!", interaction, false, true)] });
  } else

  if (subcommand === "reboot") {
    await messages.success("Bot is shutting down", interaction);
    process.exit(0);
  }
};

exports.commandData = {
  name: "admin",
  description: "Change admin settings for the bot.",
  category: "System",
  options: [{
    name: "conf",
    type: ApplicationCommandOptionType.SubcommandGroup,
    description: "Change the bot's defualt settings.",
    options: [{
      name: "add",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Add a new key & value to all guilds.",
      options: [{
        name: "key",
        type: ApplicationCommandOptionType.String,
        description: "Key to add.",
        required: true,
      },
      {
        name: "value",
        type: ApplicationCommandOptionType.String,
        description: "Value to add.",
        required: true,
      }],
    },
    {
      name: "edit",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Edit a keys default value.",
      options: [{
        name: "key",
        type: ApplicationCommandOptionType.String,
        description: "Key to edit.",
        required: true,
      },
      {
        name: "value",
        type: ApplicationCommandOptionType.String,
        description: "Value to set.",
        required: true,
      }],
    },
    {
      name: "delete",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Delete a key from all guilds.",
      options: [{
        name: "key",
        type: ApplicationCommandOptionType.String,
        description: "Key to delete.",
        required: true,
      }],
    },
    {
      name: "view",
      type: ApplicationCommandOptionType.Subcommand,
      description: "View defualt settings.",
      options: [{
        name: "key",
        type: ApplicationCommandOptionType.String,
        description: "Specific key to view.",
        required: false,
      }],
    }],
  },
  {
    name: "deploy",
    type: ApplicationCommandOptionType.Subcommand,
    description: "Deploy all slash commands to guilds.",
    options: [],
  },
  {
    name: "reboot",
    type: ApplicationCommandOptionType.Subcommand,
    description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
    options: [],
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Bot Admin",
  guildOnly: false
};