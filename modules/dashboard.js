/*
DASHBOARD EXAMPLE
This is a very simple dashboard example, but even in its simple state, there are still a
lot of moving parts working together to make this a reality. I shall attempt to explain
those parts in as much details as possible, but be aware: there's still a lot of complexity
and you shouldn't expect to really understand all of it instantly.
Pay attention, be aware of the details, and read the comments.
Note that this *could* be split into multiple files, but for the purpose of this
example, putting it in one file is a little simpler. Just *a little*.
*/

// Native Node Imports
const url = require('url');
const path = require('path');
const fs = require('fs');

// Used for Permission Resolving...
const Discord = require('discord.js');
const { Permissions } = require('discord.js');

// Express Session
const express = require('express');
const app = express();

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-discord').Strategy;

// Helmet is a security plugin
//const helmet = require('helmet');

// Used to parse Markdown from things like ExtendedHelp
const md = require('marked');

// For stats
const moment = require('moment');
require('moment-duration-format');

// For logging
const chalk = require('chalk');
const morgan = require('morgan');
// The output
// Valid variables: https://www.npmjs.com/package/morgan#dateformat
morgan.token('statusColor', (req, res, args) => {
	// get the status code if response written
	var status = (typeof res.headersSent !== 'boolean'
	? Boolean(res.header)
	: res.headersSent)
		? res.statusCode
		: undefined;
	// get status color
	var color =
		status >= 500
			? 31 // red
			: status >= 400
				? 33 // yellow
				: status >= 300
					? 36 // cyan
					: status >= 200
						? 32 // green
						: 0; // no color
	return '\x1b[' + color + 'm' + status + '\x1b[0m';
});
morgan.token(
	'morgan-output',
	`${chalk.bgBlue(':method')} :url ${chalk.blue(
		'=>'
	)} :response-time ms ${chalk.blue('=>')}  :statusColor`
);

// For CORS which fixes some problems with the api
const cors = require('cors');

module.exports = client => {
	app.use(cors());

	//this is for the apis
	const apiDir = path.resolve(`${process.cwd()}${path.sep}http${path.sep}api`);
	app.use(
		'/api/statistics',
		require(`${apiDir}${path.sep}statistics.js`)(client)
	);
	app.use('/api/commands', require(`${apiDir}${path.sep}commands.js`)(client));
	app.use('/api/guilds', require(`${apiDir}${path.sep}guilds.js`)(client));
	client.apiURL = `https://${client.config.dashboard.domain}/api`;
	client.logger.log(`API URL: ${client.apiURL}`);

	if (client.config.dashboard.enabled !== 'true')
		return client.logger.log('Dashboard disabled');
	// It's easier to deal with complex paths.
	// This resolves to: yourbotdir/dashboard/
	const dataDir = path.resolve(
		`${process.cwd()}${path.sep}http${path.sep}dashboard`
	);

	// This resolves to: yourbotdir/dashboard/pages/
	// which is the folder that stores all the internal page files.
	const templateDir = path.resolve(`${dataDir}${path.sep}views`);

	app.set('trust proxy', 5); // Proxy support
	// The public data directory, which is accessible from the *browser*.
	// It contains all css, client javascript, and images needed for the site.
	app.use(
		'/dist',
		express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: '10d' })
	);
	app.use(
		'/build',
		express.static(path.resolve(`${dataDir}${path.sep}build`), {
			maxAge: '10d'
		})
	);
	app.use(
		'/plugins',
		express.static(path.resolve(`${dataDir}${path.sep}plugins`), {
			maxAge: '10d'
		})
	);
	app.use(
		'/dashboard/dist',
		express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: '10d' })
	);
	app.use(
		'/dashboard/build',
		express.static(path.resolve(`${dataDir}${path.sep}build`), {
			maxAge: '10d'
		})
	);
	app.use(
		'/dashboard/plugins',
		express.static(path.resolve(`${dataDir}${path.sep}plugins`), {
			maxAge: '10d'
		})
	);
	app.use(morgan('morgan-output')); // Logger

	app.use('/pages', express.static(path.resolve(`${dataDir}${path.sep}pages`)));

  // These are... internal things related to passport. Honestly I have no clue either.
  // Just leave 'em there.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

	/*
	This defines the **Passport** oauth2 data. A few things are necessary here.
	clientID = Your bot's client ID, at the top of your app page. Please note,
		older bots have BOTH a client ID and a Bot ID. Use the Client one.
	clientSecret: The secret code at the top of the app page that you have to
		click to reveal. Yes that one we told you you'd never use.
	callbackURL: The URL that will be called after the login. This URL must be
		available from your PC for now, but must be available publically if you're
		ever to use this dashboard in an actual bot.
	scope: The data scopes we need for data. identify and guilds are sufficient
		for most purposes. You might have to add more if you want access to more
		stuff from the user. See: https://discordapp.com/developers/docs/topics/oauth2
	See config.js.example to set these up.
	*/

	var protocol;

	if (client.config.dashboard.secure === 'true') {
		client.protocol = 'https://';
	} else {
		client.protocol = 'http://';
	}

	protocol = client.protocol;

	client.callbackURL = `${protocol}${client.config.dashboard.domain}/callback`;
	client.logger.log(`Callback URL: ${client.callbackURL}`);
	passport.use(
		new Strategy(
			{
				clientID: client.config.dashboard.clientID,
				clientSecret: client.config.dashboard.oauthSecret,
				callbackURL: client.callbackURL,
				scope: ['identify', 'guilds']
			},
			(accessToken, refreshToken, profile, done) => {
				process.nextTick(() => done(null, profile));
			}
		)
	);

	// Session data, used for temporary storage of your visitor's session information.
	// the `secret` is in fact a 'salt' for the data, and should not be shared publicly.
	app.use(
		session({
			secret: client.config.dashboard.sessionSecret,
			resave: false,
			saveUninitialized: false
		})
	);

	// Initializes passport and session.
	app.use(passport.initialize());
	app.use(passport.session());

	// The domain name used in various endpoints to link between pages.
	app.locals.domain = client.config.dashboard.domain;

	// The EJS templating engine gives us more power
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	// body-parser reads incoming JSON or FORM data and simplifies their
	// use in code.
	var bodyParser = require('body-parser');
	app.use(bodyParser.json()); // to support JSON-encoded bodies
	app.use(
		bodyParser.urlencoded({
			// to support URL-encoded bodies
			extended: true
		})
	);

	app.use(function(req, res, next) {
		req.active = req.path.split('/')[1]; // [0] will be empty since routes start with '/'
		next();
	});

	/*
	Authentication Checks. checkAuth verifies regular authentication,
	whereas checkAdmin verifies the bot owner. Those are used in url
	endpoints to give specific permissions.
	*/
	function checkAuth(req, res, next) {
		if (req.isAuthenticated()) return next();
		req.session.backURL = req.url;
		res.redirect('/login');
	}

	function cAuth(req, res) {
		if (req.isAuthenticated()) return;
		req.session.backURL = req.url;
		res.redirect('/login');
	}

	function checkAdmin(req, res, next) {
		if (req.isAuthenticated() && req.user.id === client.config.ownerID)
			return next();
		req.session.backURL = req.originalURL;
		res.redirect('/');
	}

	/*var privacyMD = '';
	fs.readFile(`${dataDir}${path.sep}public${path.sep}PRIVACY.md`, function(err, data) {
		if (err) {
			console.log(err);
			privacyMD = 'Error';
			return;
		}
		privacyMD = data.toString().replace(/\{\{botName\}\}/g, client.user.username).replace(/\{\{email\}\}/g, client.config.dashboard.legalTemplates.contactEmail);
		if (client.config.dashboard.secure !== 'true') {
			privacyMD = privacyMD.replace('Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures.', '');
		}
	});

	var termsMD = '';
	fs.readFile(`${dataDir}${path.sep}public${path.sep}TERMS.md`, function(err, data) {
		if (err) {
			console.log(err);
			privacyMD = 'Error';
			return;
		}
		termsMD = data.toString().replace(/\{\{botName\}\}/g, client.user.username).replace(/\{\{email\}\}/g, client.config.dashboard.legalTemplates.contactEmail);
	});*/

	// Index page. If the user is authenticated, it shows their info
	// at the top right of the screen.
	app.get('/', (req, res) => {
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

	app.get('/stats', (req, res) => {
		if (client.config.dashboard.protectStats === 'true') {
			cAuth(req, res);
		}
		const duration = moment
			.duration(client.uptime)
			.format(' D [days], H [hrs], m [mins], s [secs]');
		//const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
		const members = `${client.users.cache.filter(u => u.id !== '1').size} (${
			client.users.cache.filter(u => u.id !== '1').filter(u => u.bot).size
		} bots)`;
		const textChannels = client.channels.cache.filter(c => c.type === 'text')
			.size;
		const voiceChannels = client.channels.cache.filter(c => c.type === 'voice')
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
				commands: client.commands.size,
				memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
				dVersion: Discord.version,
				nVersion: process.version,
				bVersion: client.config.version
			}
		});
	});

	app.get('/legal', function(req, res) {
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
			edited: client.config.dashboard.legalTemplates.lastEdited
		});*/

		res.render(path.resolve(`${templateDir}${path.sep}legal.ejs`), {
			bot: client,
			perms: req.isAuthenticated() ? Permissions : null,
			auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
			privacy: md(privacyMD),
			terms: md(termsMD),
			edited: client.config.dashboard.legalTemplates.lastEdited
		});
	});

	// The login page saves the page the person was on in the session,
	// then throws the user to the Discord OAuth2 login page.
	app.get(
		'/login',
		(req, res, next) => {
			if (req.session.backURL) {
				req.session.backURL = req.session.backURL;
			} else if (req.headers.referer) {
				const parsed = url.parse(req.headers.referer);
				if (parsed.hostname === app.locals.domain) {
					req.session.backURL = parsed.path;
				}
			} else {
				req.session.backURL = '/';
			}
			next();
		},
		passport.authenticate('discord')
	);

	app.get(
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

	app.get('/admin', checkAdmin, (req, res) => {
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
				text: client.channels.cache.filter(c => c.type === 'text').size,
				voice: client.channels.cache.filter(c => c.type === 'voice').size,
				servers: client.guilds.cache.size,
				commands: client.commands.size,
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

	app.get('/servers', checkAuth, (req, res) => {
		res.render(path.resolve(`${templateDir}${path.sep}servers.ejs`), {
			perms: Permissions,
			bot: client,
			user: req.user,
			auth: true
		});
	});

	app.get('/add/:guildID', checkAuth, (req, res) => {
		req.session.backURL = '/dashboard';
		var invitePerm = client.config.dashboard.invitePerm;
		var inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${
			client.config.dashboard.clientID
		}&scope=bot&guild_id=${
			req.params.guildID
		}&response_type=code&redirect_uri=${encodeURIComponent(
			`${client.callbackURL}`
		)}&permissions=${invitePerm}`;
		if (client.guilds.cache.has(req.params.guildID)) {
			res.send(
				'<p>The bot is already there... <script>setTimeout(function () { window.location="/servers"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/servers" /></noscript>'
			);
		} else {
			res.redirect(inviteURL);
		}
	});

//------------------------ Dashboard Main Page -------------------------------------

	app.post('/dashboard/:guildID', checkAuth, (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged =
			guild && !!guild.member(req.user.id)
				? guild.member(req.user.id).permissions.has('MANAGE_GUILD')
				: false;
		if (req.user.id === client.config.ownerID) {
			console.log(`Admin bypass for managing server: ${req.params.guildID}`);
		} else if (!isManaged) {
			res.redirect('/');
		}
    
		const settings = client.getSettings(guild);

		if (req.body.nickname) {
			client.guilds.cache.get(req.params.guildID).members.cache.get(client.user.id).setNickname(req.body.nickname);
		}
		if (req.body.prefix) {
			settings.prefix = req.body.prefix;
		}
		if (req.body.adminRole) {
			settings.adminRole = req.body.adminRole;
		}
		if (req.body.modRole) {
			settings.modRole = req.body.modRole;
		}
		if (!req.body.systemNotice) {
			settings.systemNotice = "false"
		} else {
		  settings.systemNotice = "true"
		}


		client.settings.set(guild.id, settings);
		res.redirect(`/dashboard/${req.params.guildID}`);
	});

	app.get('/dashboard/:guildID', checkAuth, (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged =
			guild && !!guild.member(req.user.id)
				? guild.member(req.user.id).permissions.has('MANAGE_GUILD')
				: false;
		if (req.user.id === client.config.ownerID) {
			console.log(`Admin bypass for managing server: ${req.params.guildID}`);
		} else if (!isManaged) {
			res.redirect('/servers');
		}

		res.render(
			path.resolve(
				`${templateDir}${path.sep}dashboard${path.sep}dashboard.ejs`
			),
			{
				perms: Permissions,
				bot: client,
				guild: guild,
				user: req.user,
				auth: true
			}
		);
	});

//------------------------ Dashboard Moderation Page -------------------------------------

	app.get('/leave/:guildID', checkAuth, async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged =
			guild && !!guild.member(req.user.id)
				? guild.member(req.user.id).permissions.has('MANAGE_GUILD')
				: false;
		if (req.user.id === client.config.ownerID) {
			console.log(`Admin bypass for managing server: ${req.params.guildID}`);
		} else if (!isManaged) {
			res.redirect('/servers');
		}
		await guild.leave();
		if (req.user.id === client.config.ownerID) {
			return res.redirect('/admin');
		}
		res.redirect('/servers');
	});

	app.get('/reset/:guildID', checkAuth, async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged =
			guild && !!guild.member(req.user.id)
				? guild.member(req.user.id).permissions.has('MANAGE_GUILD')
				: false;
		if (req.user.id === client.config.ownerID) {
			console.log(`Admin bypass for managing server: ${req.params.guildID}`);
		} else if (!isManaged) {
			res.redirect('/servers');
		}
		client.settings.delete(guild.id);
		res.redirect(`/dashboard/${req.params.guildID}`);
	});

	app.get('/commands', (req, res) => {
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


  // Destroys the session to log out the user.
  app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

	app.get('*', function(req, res) {
		// Catch-all 404
		res.send(
			'<p>404 File Not Found. Please wait...<p> <script>setTimeout(function () { window.location = "/"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/" /></noscript>'
		);
	});

	client.site = app
		.listen(client.config.dashboard.port, function() {
			client.logger.log(
				`Dashboard and API running on port ${client.config.dashboard.port}`
			);
		})
		.on('error', err => {
			client.logger.log('ERROR', `Error with starting dashboard: ${err.code}`);
			return process.exit(0);
		});
};
