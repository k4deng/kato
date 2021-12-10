const config = {
  //Bots Version
  "version": "2.1.6",

  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": "805546498028208190",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": ["686964467086524436"],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],
  
  //Suggestions channel, this is where the suggest command outputs Suggestions
  "suggestionsChannel": "822487770319945755",

  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  "token": process.env.token,

  // Intents the bot needs.
  // By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
  // For join messages to work you need Guild Members, which is privileged and requires extra setup.
  // For more info about intents see the README.
  intents: ["GUILDS","GUILD_MESSAGES","DIRECT_MESSAGES","GUILD_BANS","GUILD_EMOJIS","GUILD_INTEGRATIONS","GUILD_WEBHOOKS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING","GUILD_PRESENCES","GUILD_MEMBERS"],

  dashboard: {
		enabled: 'true', // This setting controls whether the dashboard is enabled or not.
    clientID: '806261648015753276', // the bots id
		oauthSecret: process.env.dashboardOauthSecret, // The client secret from the Discord bot page
		secure: 'true', // HTTPS: 'true' for true, 'false' for false
		sessionSecret: process.env.dashboardSessionSecret, // Go crazy on the keyboard here, this is used as a session secret
		domain: 'katobot.tk', // Domain name (with port if not running behind proxy running on port 80). Example: 'domain': 'dashboard.bot-website.com' OR 'domain': 'localhost:33445'
		port: '3000', // The port that it should run on
		invitePerm: '536079575', //the bots invite link oauth permission integer
		protectStats: 'false', //if stats page is visible
		borderedStats: 'true', // Controls whether stats in the dashboard should have a border or not
		legalTemplates: {
			contactEmail: 'contact@k4deng.ml', // This email will be used in the legal page of the dashboard if someone needs to contact you for any reason regarding this page
			lastEdited: '4 April 2021' // Change this if you update the `TERMS.md` or `PRIVACY.md` files in `dashboard/public/`
    }
  },

  // Default settings. fill out before you start bot
  defaultSettings : {
    "prefix": "k!",
    "modLogChannel": "mod-log",
    "modRole": "ModeratorRole",
    "adminRole": "AdministratorRole",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "welcomeChannel": "123456789123456789",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "welcomeEnabled": "false"
  },

  // PERMISSION LEVEL DEFINITIONS.
  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
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
          const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.cache.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 4,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    // Updated to utilize the Teams type from the Application, pulls a list of "Owners" from it.
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to a list of owners found in the bot application.
      check: (message) => message.client.owners.includes(message.author.id)
    }
  ]
};

module.exports = config;
