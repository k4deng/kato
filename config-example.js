const { GatewayIntentBits, Partials } = require("discord.js");

/* config */
const config = {
  /*
  * Intents the bot needs.
  * By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
  * For join messages to work you need Guild Members, which is privileged and requires extra setup.
  * For more info about intents see the README.
  */
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ],
  // Partials your bot may need should go here, CHANNEL is required for DM's
  partials: [ Partials.Channel ],

  "invitePerm": "1615947361495", // The bots invite link oauth permission integer
  
  // The hex code "color" of your bot. used for embeds and leveling and other things
  "themeColor": "#1E30D6",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],
  
  // Suggestions channel, this is where the suggest command outputs Suggestions
  "suggestionsChannel": "123456789123456789",

  // Channel to post rate limits to
  "rateLimitChannelID": "123456789123456789",
  
  // Points
  "points": {
    "cooldownSeconds": 60,
    "xpMin": 1,
    "xpMax": 10
  },

  dashboard: {
    version: "1.3.1",
    enabled: "true", // This setting controls whether the dashboard is enabled or not.
    clientID: "123456789123456789", // the bots id
    supportDiscord: "https://discord.gg/invitecode", //discord support server url for the bot
    oauthSecret: "copy-me-from-discord", // The client secret from the Discord bot page
    secure: "true", // HTTPS: 'true' for true, 'false' for false
    sessionSecret: "spam-me", // Go crazy on the keyboard here, this is used as a session secret
    domain: "example.com", // Domain name (with port if not running behind proxy running on port 80). Example: 'domain': 'dashboard.bot-website.com' OR 'domain': 'localhost:33445'
    port: "3000", // The port that it should run on
    protectStats: "false", //if stats page is visible
    legalTemplates: {
      contactEmail: "johndoe@example.com", // This email will be used in the legal page of the dashboard if someone needs to contact you for any reason regarding this page
      lastEdited: "16 April 2021" // Change this if you update the `TERMS.md` or `PRIVACY.md` files in `dashboard/public/`
    }
  },

  // log console to a folder and keep track of errors and whatnot
  "fileLogging": false,
  
  // This will spam your console if you enable this but will help with bug fixing
  "debug": false,
  
  /*
  * Default per-server settings. These settings are entered in a database on first load, 
  * And are then completely ignored from this file. To modify default settings, use the `conf` command.
  * DO NOT REMOVE THIS BEFORE YOUR BOT IS LOADED AND FUNCTIONAL.
  */
  "defaultSettings" : {
    "prefix": "~",
    "modLogChannel": "",
    "modRole": "",
    "adminRole": "",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "commandReply": "true", // Toggle this if you want the bot to ping the command executor or not.
    
    "welcomeChannel": "",
    "welcomeMessage": "{{user}} just joined the server!",
    "welcomeEnabled": "false",

    "levelOption": 1, // 0 = no announcement, 1 = reply, 2 = choosen channel
    "levelChannel": "",
    "levelMessage": "{user} leveled up to level **{level}**!",
    "levelIgnoreRoles": [""],
    "levelIgnoreChannels": [""],
    "levelMultiplier": 1
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permission level, this is for users without a role.
    { level: 0,
      name: "User", 
      /*
      * Don't bother checking, just return true which allows them to execute any command their
      * level allows them to.
      */
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      /*
      * The following lines check the guild the message came from for the roles.
      * Then it checks if the member that authored the message has the role.
      * If they do return true, which will allow them to execute the command in question.
      * If they don't then return false, which will prevent them from executing the command.
      */
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(r => r.id === message.settings.modRole);
          if (modRole && message.member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.cache.find(r => r.id === message.settings.adminRole);
          return (adminRole && message.member.roles.cache.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    
    // This is the server owner.
    { level: 4,
      name: "Server Owner", 
      /*
      * Simple check, if the guild owner id matches the message author's ID, then it will return true.
      * Otherwise it will return false.
      */
      check: (message) => {
        const serverOwner = message.author ?? message.user;
        return message.guild?.ownerId === serverOwner.id;
      }
    },
    
    /*
    * Bot Support is a special in between level that has the equivalent of server owner access
    * to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    */
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => {
        const botSupport = message.author ?? message.user;
        return config.support.includes(botSupport.id);
      }
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => {
        const botAdmin = message.author ?? message.user;
        return config.admins.includes(botAdmin.id);
      }
    },
    
    /*
    * This is the bot owner, this should be the highest permission level available.
    * The reason this should be the highest level is because of dangerous commands such as eval
    * or exec (if the owner has that).
    * Updated to utilize the Teams type from the Application, pulls a list of "Owners" from it.
    */
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to a list of owners found in the bot application.
      check: (message) => {
        const owner = message.author ?? message.user;
        return owner.id === process.env.OWNER;
      }
    }
  ]
};

module.exports = config;
