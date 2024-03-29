const { ApplicationCommandOptionType } = require("discord.js");
const { getPoints } = require("../../modules/functions.js");
const { points } = require("../../modules/settings.js");
const { error } = require("../../modules/messages.js");
const { themeColor } = require("../../config.js");
const { Rank: rank } = require("canvacord");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  var user = interaction.guild.members.cache.get(interaction.options.get("user")?.value) ?? interaction.member;
  
  var key = `${interaction.guild.id}-${user.user.id}`;
  if (user.user?.bot) return error("You cannot get the rank of a bot, silly.", interaction);
  if (!points.has(key)) return error(`${user.user.id == interaction.member.id ? "You dont" : "That user doesnt"} have any data.`, interaction);
  
  const res = await createRankCard(interaction.guild, user);
  await interaction.reply({ files: [res] });

  function createRankCard(guild, target) {
    const user = getPoints(target, guild);
    const filtered = points.filter( p => p.guild === guild.id ).array();
    const res = filtered.sort((a, b) => b.points - a.points);

    let rankScore;
    for (let i = 0; i < res.length; i++) {
      if (res[i].user == target.user.id) rankScore = i;
    }

    function lvlPoints(lvl) { return 2*Math.pow(lvl, 3)+25; }

    // create rank card
    const rankcard = new rank()
      .setAvatar(target.user.displayAvatarURL({ extension: "png", size: 1024 }))
      .setCurrentXP(user.level == 0 ? user.points : user.points-lvlPoints(user.level))
      .setLevel(user.level)
      .setRank(rankScore + 1)
      .setRequiredXP(user.level == 0 ? lvlPoints(user.level + 1) : lvlPoints(user.level + 1)-lvlPoints(user.level))
      .setStatus(target.presence?.status ?? "offline", true)
      //.setCustomStatusColor(themeColor) -for theme color if wanted later
      .setProgressBar(["#FFFFFF", themeColor], "GRADIENT")
      .setUsername(target.user.username);
      //.setDiscriminator(target.user.discriminator);
    
    return rankcard.build();
  }
};

exports.commandData = {
  name: "rank",
  description: "Shows your server rank/level.",
  category: "Points",
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "User to view rank of.",
    required: false,   
  }],
  dmPermission: false,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};