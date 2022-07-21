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

// things
const config = require("../../config.js");
const { getSettings } = require("../functions.js");
const { settings } = require("../settings.js");

// Native Node Imports
const path = require("path");

// Used for Permission Resolving...
const { PermissionsBitField } = require("discord.js");

// Express Session
const express = require("express");
const app = express();

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;

// Helmet is a security plugin
//const helmet = require('helmet');

// For logging
const logger = require("../logger.js");
const chalk = require("chalk");
const morgan = require("morgan");
// The output
// Valid variables: https://www.npmjs.com/package/morgan#dateformat
morgan.token("statusColor", (req, res) => {
  // get the status code if response written
  var status = (typeof res.headersSent !== "boolean"
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
  return "\x1b[" + color + "m" + status + "\x1b[0m";
});
morgan.token(
  "morgan-output",
  `${chalk.bgBlue(":method")} :url ${chalk.blue(
    "=>"
  )} :response-time ms ${chalk.blue("=>")}  :statusColor`
);

// For CORS which fixes some problems with the api
const cors = require("cors");

module.exports = client => {
  client.config = config;
  client.getSettings = getSettings;
  client.settings = settings;
  app.use(cors());

  //this is for the apis
  const apiDir = path.resolve(`${process.cwd()}${path.sep}http${path.sep}api`);
  app.use("/api/statistics", require(`${apiDir}${path.sep}statistics.js`)(client));
  app.use("/api/commands", require(`${apiDir}${path.sep}commands.js`)(client));
  app.use("/api/guilds", require(`${apiDir}${path.sep}guilds.js`)(client));
  app.use("/api/logs", require(`${apiDir}${path.sep}logs.js`)(client));
  client.apiURL = `https://${config.dashboard.domain}/api`;
  logger.log(`API URL: ${client.apiURL}`);

  if (config.dashboard.enabled !== "true")
    return logger.log("Dashboard disabled");
  // It's easier to deal with complex paths.
  // This resolves to: yourbotdir/dashboard/
  const dataDir = path.resolve(
    `${process.cwd()}${path.sep}http${path.sep}dashboard`
  );

  // Logger
  app.use(morgan("morgan-output"));

  // This resolves to: yourbotdir/dashboard/pages/
  // which is the folder that stores all the internal page files.
  const templateDir = path.resolve(`${dataDir}${path.sep}views`);

  app.set("trust proxy", 5); // Proxy support
  // this does something... i dont really know what... dont remove it or it will break css
  // if you find a better way please fix it
  app.use("/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/dashboard/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/dashboard/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/dashboard/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/members/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/members/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/members/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/moderation/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/moderation/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/moderation/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/leveling/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/leveling/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/leveling/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/leaderboard/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/leaderboard/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/leaderboard/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));
  app.use("/welcome/dist", express.static(path.resolve(`${dataDir}${path.sep}dist`), { maxAge: "10d" }));
  app.use("/welcome/build", express.static(path.resolve(`${dataDir}${path.sep}build`), { maxAge: "10d" }));
  app.use("/welcome/plugins", express.static(path.resolve(`${dataDir}${path.sep}plugins`), { maxAge: "10d" }));

  app.use("/pages", express.static(path.resolve(`${dataDir}${path.sep}pages`)));

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
  if (config.dashboard.secure === "true")  client.protocol = "https://";
  else client.protocol = "http://";

  protocol = client.protocol;

  client.callbackURL = `${protocol}${config.dashboard.domain}/callback`;
  logger.log(`Callback URL: ${client.callbackURL}`);
  passport.use(
    new Strategy(
      {
        clientID: config.dashboard.clientID,
        clientSecret: config.dashboard.oauthSecret,
        callbackURL: client.callbackURL,
        scope: ["identify", "guilds"]
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
      secret: config.dashboard.sessionSecret,
      resave: false,
      saveUninitialized: false
    })
  );

  // Initializes passport and session.
  app.use(passport.initialize());
  app.use(passport.session());

  // The EJS templating engine gives us more power
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  // body-parser reads incoming JSON or FORM data and simplifies their
  // use in code.
  const bodyParser = require("body-parser");
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true
    })
  );

  app.use(function(req, res, next) {
    req.active = req.path.split("/")[1]; // [0] will be empty since routes start with '/'
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
    res.redirect("/login");
  }

  function cAuth(req, res) {
    if (req.isAuthenticated()) return;
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.id === process.env.OWNER)
      return next();
    req.session.backURL = req.originalURL;
    res.redirect("/");
  }

  // im using this for changing settings cause its easy
  function changeSetting(guild, key, value) {
    if (getSettings(guild)[key] != value) {
      if (!settings.has(guild.id)) settings.set(guild.id, {});
      settings.set(guild.id, value, key);
    }
    if (settings.has(guild.id) && getSettings()[key] == value) settings.delete(guild.id, key);
  }

  app.use("/", require("./routes/site")(client, dataDir, templateDir, checkAuth, cAuth, checkAdmin));

  app.use("/", require("./routes/dashboard")(client, templateDir, checkAuth, changeSetting));

  // 404 errors
  app.get("*", function(req, res) {
    if (req.isAuthenticated()) {
      res.status(404).render(path.resolve(`${templateDir}${path.sep}error.ejs`), {
        perms: PermissionsBitField,
        bot: client,
        auth: true,
        user: req.user,
        errorNum: "404",
        errorStyle: "warning",
        errorDesc: "Oops! Page not found."
      });
    } else {
      res.status(404).render(path.resolve(`${templateDir}${path.sep}error.ejs`), {
        bot: client,
        auth: false,
        user: null,
        errorNum: "404",
        errorStyle: "warning",
        errorDesc: "Oops! Page not found."
      });
    }
  });

  client.site = app
    .listen(config.dashboard.port, function() {
      logger.log(
        `Dashboard and API running on port ${config.dashboard.port}`
      );
    })
    .on("error", err => {
      logger.log("ERROR", `Error with starting dashboard: ${err.code}`);
      return process.exit(0);
    });
};
