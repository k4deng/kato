// Dependecies
const express = require('express');
const router = express.Router();

// things
const config = require("../../../config.js");

// Native Node Imports
const url = require('url');
const path = require('path');

// Used for Permission Resolving...
const Discord = require('discord.js');
const { Permissions } = require('discord.js');

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
const passport = require('passport');

// Used to parse Markdown from things like ExtendedHelp
const md = require('marked');

// For stats
const moment = require('moment');
require('moment-duration-format');

module.exports = function(client, dataDir, templateDir, checkAuth, cAuth, checkAdmin) {
	// The login page saves the page the person was on in the session,
  // then throws the user to the Discord OAuth2 login page.
  router.get(
    '/login',
    (req, res, next) => {
      if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === config.dashboard.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = req.session.backURL ?? '/';
      }
      next();
    },
    passport.authenticate('discord')
  );

  router.get(
    '/callback',
    passport.authenticate('discord', {
      failureRedirect: '/'
    }),
    (req, res) => {
      if (req.session.backURL) {
        res.redirect(req.session.backURL);
        req.session.backURL = null;
      } else {
        res.redirect('/');
      }
    }
  );

  // Destroys the session to log out the user.
  router.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });
  
  // index page
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(
        path.resolve(`${dataDir}${path.sep}views${path.sep}index.ejs`),
        {
          perms: Permissions,
          bot: client,
          auth: true,
          user: req.user
        }
      );
    } else {
      res.render(
        path.resolve(`${dataDir}${path.sep}views${path.sep}index.ejs`),
        {
          bot: client,
          auth: false,
          user: null
        }
      );
    }
  });

  // Commands list
  router.get('/commands', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}commands.ejs`), {
        perms: Permissions,
        bot: client,
        auth: true,
        user: req.user,
        md: md
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}commands.ejs`), {
        bot: client,
        auth: false,
        user: null,
        md: md
      });
    }
  });

  // TODO: MAKE
  router.get('/stats', (req, res) => {
    if (config.dashboard.protectStats === 'true') {
      cAuth(req, res);
    }
    const duration = moment
      .duration(client.uptime)
      .format(' D [days], H [hrs], m [mins], s [secs]');
    //const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
    const members = `${client.users.cache.filter(u => u.id !== '1').size} (${
      client.users.cache.filter(u => u.id !== '1').filter(u => u.bot).size
      } bots)`;
    const textChannels = client.channels.cache.filter(c => c.type === 'GUILD_TEXT')
      .size;
    const voiceChannels = client.channels.cache.filter(c => c.type === 'GUILD_VOICE')
      .size;
    const guilds = client.guilds.cache.size;
    res.render(path.resolve(`${templateDir}${path.sep}stats.ejs`), {
      bot: client,
      perms: req.isAuthenticated() ? Permissions : null,
      auth: req.isAuthenticated() ? true : false,
      user: req.isAuthenticated() ? req.user : null,
      stats: {
        servers: guilds,
        members: members,
        text: textChannels,
        voice: voiceChannels,
        uptime: duration,
        commands: client.container.commands.size,
        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        dVersion: Discord.version,
        nVersion: process.version,
        bVersion: client.config.version
      }
    });
  });

  // Status Page (Under Construction)
  router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        perms: Permissions,
        bot: client,
        auth: true,
        user: req.user,
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        bot: client,
        auth: false,
        user: null,
      });
    }
  });

  // Docs Page (Under Construction)
  router.get('/docs', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        perms: Permissions,
        bot: client,
        auth: true,
        user: req.user,
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        bot: client,
        auth: false,
        user: null,
      });
    }
  });

  // Premium Information Page (Under Construction)
  router.get('/premium', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        perms: Permissions,
        bot: client,
        auth: true,
        user: req.user,
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}construction.ejs`), {
        bot: client,
        auth: false,
        user: null,
      });
    }
  });

  // privacy policy and terms of service
  router.get('/legal', function(req, res) {
    md.setOptions({
      renderer: new md.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

		/*var showdown	= require('showdown');
		var	converter = new showdown.Converter(),
			textPr			= privacyMD,
			htmlPr			= converter.makeHtml(textPr),
			textTe			= termsMD,
			htmlTe			= converter.makeHtml(textTe);
		res.render(path.resolve(`${templateDir}${path.sep}legal.ejs`), {
			bot: client,
			auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
			privacy: htmlPr.replace(/\\'/g, `'`),
			terms: htmlTe.replace(/\\'/g, `'`),
			edited: config.dashboard.legalTemplates.lastEdited
		});*/

    res.render(path.resolve(`${templateDir}${path.sep}legal.ejs`), {
      bot: client,
      perms: req.isAuthenticated() ? Permissions : null,
      auth: req.isAuthenticated() ? true : false,
      user: req.isAuthenticated() ? req.user : null,
      privacy: md(privacyMD),
      terms: md(termsMD),
      edited: config.dashboard.legalTemplates.lastEdited
    });
  });

  // admin page for owner only
  router.get('/admin', checkAdmin, (req, res) => {
    //const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    );
    const totalMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
      2
    );
    res.render(path.resolve(`${templateDir}${path.sep}admin.ejs`), {
      perms: Permissions,
      bot: client,
      user: req.user,
      auth: true,
      stats: {
        members: client.users.cache.filter(u => u.id !== '1').size,
        bots: client.users.cache.filter(u => u.id !== '1').filter(u => u.bot)
          .size,
        text: client.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
        voice: client.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
        servers: client.guilds.cache.size,
        commands: client.container.commands.size + client.container.slashcmds.size,
        uptime: moment
          .duration(client.uptime)
          .format(' D [d], H [h], m [m], s [s]'),
        msgps: client.botMessagesSent / (client.uptime / 1000).toFixed(2),
        memoryUsage: memoryUsage,
        totalMemory: totalMemory,
        memoryUsagePercent: parseInt((memoryUsage / totalMemory) * 100),
        dVersion: Discord.version,
        nVersion: process.version,
        bVersion: client.config.version
      }
    });
  });

  // shows all managable servers
  router.get('/servers', checkAuth, (req, res) => {
    res.render(path.resolve(`${templateDir}${path.sep}servers.ejs`), {
      perms: Permissions,
      bot: client,
      user: req.user,
      auth: true
    });
  });

  // prompts to add to specific server
  router.get('/add/:guildID', checkAuth, (req, res) => {
    req.session.backURL = '/dashboard';
    var inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${
      config.dashboard.clientID
      }&scope=bot&guild_id=${
      req.params.guildID
      }&response_type=code&redirect_uri=${encodeURIComponent(
        `${client.callbackURL}`
      )}&permissions=${config.invitePerm}`;
    if (client.guilds.cache.has(req.params.guildID)) {
      res.send(
        '<p>The bot is already there... <script>setTimeout(function () { window.location="/servers"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/servers" /></noscript>'
      );
    } else {
      res.redirect(inviteURL);
    }
  });

  // generic bot invite link
  router.get('/invite', (req, res) => {
    var inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${config.dashboard.clientID}&scope=bot%20applications.commands&permissions=${config.invitePerm}`;
    res.redirect(inviteURL);
  });

  // redirect to bot support discord
  router.get('/support', (req, res) => {
    res.redirect(config.dashboard.supportDiscord);
  });

	return router;
};
