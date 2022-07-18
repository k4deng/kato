// Dependecies
const express = require("express");
const router = express.Router();

// things
const { getSettings } = require("../../functions.js");
const { points } = require("../../settings.js");

// Native Node Imports
const path = require("path");

// Used for Permission Resolving...
const { PermissionsBitField, ChannelType } = require("discord.js");

// For stats
const moment = require("moment");
require("moment-duration-format");

module.exports = function(client, templateDir, checkAuth, changeSetting) {
  //------------------------ Dashboard Main Page ------------------------------

  router.post("/dashboard/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).PermissionsBitField.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/");
    }

    if (req.body.nickname) client.guilds.cache.get(req.params.guildID).members.cache.get(client.user.id).setNickname(req.body.nickname);
    changeSetting(guild, "prefix", req.body.prefix);
    changeSetting(guild, "adminRole", req.body.adminRole);
    changeSetting(guild, "modRole", req.body.modRole);
    changeSetting(guild, "systemNotice", !req.body.systemNotice ? "false" : "true");

    res.redirect(`/dashboard/${req.params.guildID}`);
  });

  router.get("/dashboard/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    res.render(
      path.resolve(
        `${templateDir}${path.sep}dashboard${path.sep}dashboard.ejs`
      ),
      {
        perms: PermissionsBitField,
        bot: client,
        guild: guild,
        user: req.user,
        auth: true
      }
    );
  });

  //------------------------ Dashboard Moderation Page ------------------------

  router.post("/moderation/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/");
    }

    changeSetting(guild, "modLogChannel", req.body.modLogChannel);

    res.redirect(`/moderation/${req.params.guildID}`);
  });

  router.get("/moderation/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    res.render(
      path.resolve(
        `${templateDir}${path.sep}dashboard${path.sep}moderation.ejs`
      ),
      {
        perms: PermissionsBitField,
        ChannelType: ChannelType,
        bot: client,
        guild: guild,
        user: req.user,
        auth: true
      }
    );
  });

  //------------------------ Dashboard Leveling -------------------------------

  router.post("/leveling/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/");
    }

    changeSetting(guild, "levelOption", req.body.levelOption);
    if (req.body.levelOption == "2") changeSetting(guild, "levelChannel", req.body.levelChannel);
    changeSetting(guild, "levelMultiplier", req.body.levelMultiplier);
    changeSetting(guild, "levelMessage", req.body.levelMessage == "" ? getSettings()["levelMessage"] : req.body.levelMessage);
    if (Array.isArray(req.body.levelIgnoreRoles)) changeSetting(guild, "levelIgnoreRoles", req.body.levelIgnoreRoles);
    else changeSetting(guild, "levelIgnoreRoles", [req.body.levelIgnoreRoles ?? ""]);
    if (Array.isArray(req.body.levelIgnoreChannels)) changeSetting(guild, "levelIgnoreChannels", req.body.levelIgnoreChannels);
    else changeSetting(guild, "levelIgnoreChannels", [req.body.levelIgnoreChannels ?? ""]);

    res.redirect(`/leveling/${req.params.guildID}`);
  });

  router.get("/leveling/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    res.render(
      path.resolve(
        `${templateDir}${path.sep}dashboard${path.sep}level.ejs`
      ),
      {
        perms: PermissionsBitField,
        ChannelType: ChannelType,
        bot: client,
        guild: guild,
        user: req.user,
        auth: true
      }
    );
  });

  router.get("/leaderboard/:guildID", (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    
    let isManaged =
        guild && guild.members.cache.get(req.user?.id)
          ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
          : false;
    if (req.user?.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
      isManaged = true;
    }

    const filtered = points.filter( p => p.guild === guild.id ).array();
    const resp = filtered.sort((a, b) => b.points - a.points);
    
    res.render(path.resolve(`${templateDir}${path.sep}dashboard${path.sep}leaderboard.ejs`), {
      perms: PermissionsBitField,
      bot: client,
      guild: guild,
      auth: req.isAuthenticated() ? true : false,
      user: req.isAuthenticated() ? req.user : null,
      managed: isManaged,
      ranks: resp,
    });
  });

  //------------------------ Dashboard Members Page ---------------------------

  router.get("/members/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    const returnObject = [];
    for (const m of guild.members.cache.values()) {
      returnObject.push({
        id: m.id,
        status: m.presence?.status ?? "Offline",
        bot: m.user.bot,
        username: m.user.username,
        displayName: m.displayName,
        tag: m.user.tag,
        discriminator: m.user.discriminator,
        joinedAt: m.joinedTimestamp,
        createdAt: m.user.createdTimestamp,
        highestRole: {
          hexColor: m.displayColor
        },
        memberFor: moment.duration(Date.now() - m.joinedAt).format(" D [days], H [hrs], m [mins], s [secs]"),
        roles: m.roles.cache.map(r=>({
          name: r.name,
          id: r.id,
          hexColor: r.hexColor
        }))
      });
    }

    res.render(
      path.resolve(
        `${templateDir}${path.sep}dashboard${path.sep}members.ejs`
      ),
      {
        moment: moment,
        members: returnObject,
        perms: PermissionsBitField,
        bot: client,
        guild: guild,
        user: req.user,
        auth: true
      }
    );
  });

  //------------------------ Dashboard Welcome Page ---------------------------

  router.post("/welcome/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/");
    }

    const welcomeEnabled = !req.body.welcomeEnabled ? "false" : "true";
    changeSetting(guild, "welcomeEnabled", welcomeEnabled);
    if (welcomeEnabled) changeSetting(guild, "welcomeChannel", req.body.welcomeChannel);
    if (welcomeEnabled) changeSetting(guild, "welcomeMessage", req.body.welcomeMessage == "" ? getSettings()["welcomeMessage"] : req.body.welcomeMessage);

    res.redirect(`/welcome/${req.params.guildID}`);
  });

  router.get("/welcome/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    res.render(
      path.resolve(
        `${templateDir}${path.sep}dashboard${path.sep}welcome.ejs`
      ),
      {
        perms: PermissionsBitField,
        ChannelType: ChannelType,
        bot: client,
        guild: guild,
        user: req.user,
        auth: true
      }
    );
  });
  
  //------------------------ Dashboard Functions ------------------------------

  // Resets levels for a guild
  router.get("/levelreset/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }

    const guildpoints = points.filter( p => p.guild === guild.id ).array();
    if (!guildpoints[0]) {
      // If there no results
      console.log("No data found; There are no users on the leaderboard.");
    } else {
      console.log(points.filter( p => p.guild === guild.id ));
      for (const user of guildpoints) {
        points.delete(`${user.guild}-${user.user}`);
      }
    }
    
    res.redirect(`/leaderboard/${req.params.guildID}`);
  });

  // forces bot to leave a guild
  router.get("/leave/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }
    await guild.leave();
    if (req.user.id === process.env.OWNER) {
      return res.redirect("/admin");
    }
    res.redirect("/servers");
  });

  // resets settings for a guild
  router.get("/reset/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && guild.members.cache.get(req.user.id)  
        ? guild.members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === process.env.OWNER) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/servers");
    }
    client.settings.delete(guild.id);
    res.redirect(`/dashboard/${req.params.guildID}`);
  });
  
  return router;
};
