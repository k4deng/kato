exports.run = async (client, message, args, level) => {

const Discord = require('discord.js');
const moment = require('moment');

const strings = args.join(' ').split(',');
const question = strings[0];
const desc = strings[1];
const stringTime = strings[2];

const time = parseFloat(stringTime);
const formatTime = moment.duration(time, "m").format(' D [days], H [hrs], m [mins]');

var emojiList = ['813181281265254460','813181280899301458'];
var emojiNameList = ['yea','nah'];
var embed = new Discord.MessageEmbed()
    .addField(`**${question}**`, `_${desc}_`)
    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM") // Green: 0x00AE86
    .setTimestamp();
    
if (time) {
    embed.setFooter(`The vote will last ${formatTime}`);
} else {
    embed.setFooter(`The vote has no end time`);
}
    
message.del(); // Remove the user's command message

message.channel.send({embed}) // Use a 2d array?
    .then(async function(message) {
        var reactionArray = [];
        reactionArray[0] = await message.react(emojiList[0]);
        reactionArray[1] = await message.react(emojiList[1]);
        
        if (time) {
            setTimeout(() => {
                // Re-fetch the message and get reaction counts
                message.channel.messages.fetch(message.id)
                    .then(async function(message) {
                        var reactionCountsArray = [];                               
                        for (var i = 0; i < reactionArray.length; i++) {
                            reactionCountsArray[i] = message.reactions.cache.get(emojiList[i]).count-1;
                        }
                        
                        // Find winner(s)
                        var max = -Infinity, indexMax = [];
                        for (var i = 0; i < reactionCountsArray.length; ++i)
                            if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                            else if (reactionCountsArray[i] === max) indexMax.push(i);
                          
                        // Display winner(s)
                        console.log(reactionCountsArray); // Debugging votes
                        var winnersText = "";
                        if (reactionCountsArray[indexMax[0]] == 0) {
                            winnersText = "No one voted!";
                        } else {
                            for (var i = 0; i < indexMax.length; i++) {
                                winnersText += 
                                    `<:${emojiNameList[indexMax[i]]}:${emojiList[indexMax[i]]}> with ` + reactionCountsArray[indexMax[i]] + " vote(s)\n";
                            }
                        }
                        embed.addField("**Winner(s):**", winnersText);
                        embed.setFooter(`The vote is now closed! It lasted ${formatTime}`);
                        embed.setTimestamp();
                        message.edit("", embed);
                    });
            }, time * 60 * 1000);
        }
    });

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["yesno", "vote"],
  permLevel: "User",
  botPermissions: ["ADD_REACTIONS"]
};

exports.help = {
  name: "poll",
  subfolder: "reaciton",
  category: "Reaction",
  description: "Makes a poll",
  usage: "poll <title>, <description>, [time in minutes]"
};