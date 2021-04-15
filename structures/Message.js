const { Structures } = require('discord.js');

module.exports = Structures.extend('Message', Message => {
	class CustomMessage extends Message {
		constructor(bot, data, channel) {
			super(bot, data, channel);
		}

    del(args) {
      if (args) {
        if (this.deletable) this.delete(({ timeout: args}));
      } else {
        if (this.deletable) this.delete();
      };
		}

    nosetchannel(args) {
			try {

        const channel = this.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(this.guild.me).has('SEND_MESSAGES'));

				const emoji = channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS') ? "<:nah:813181113056755762>" : ':negative_squared_cross_mark:';

				return channel.send({ embed:{ color:"RED", description:`${emoji} **Sorry to interupt in this channel but, ${args}**` } });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		}

    botperms(args) {
			try {
				const emoji = this.channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS') ? "<:nah:813181113056755762>" : ':negative_squared_cross_mark:';

				return this.channel.send({ embed:{ color:"RED", description:`${emoji} **I don't have the required permissions to execute this command!**\n  • I need the **${args}** permission.` } });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		}

    userperms(level, cmd) {
			try {
				const emoji = this.channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS') ? "<:nah:813181113056755762>" : ':negative_squared_cross_mark:';

				return this.channel.send({ embed:{ color:"RED", description:`${emoji} **You don\'t have the required permissions to use this command!**\n  • Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})\n  • This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})` } });


			} catch (err) {
				this.client.logger.error(err.message);
			}
		}

		// This will add the error emoji as the prefix and then send the args
		error(args) {
			try {
				let emoji;
				if (this.channel.type == 'dm') {
					emoji = "<:nah:813181113056755762>";
				} else {
					emoji = this.channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS') ? "<:nah:813181113056755762>" : ':negative_squared_cross_mark:';
				}
				return this.channel.send({ embed:{ color:"RED", description:`${emoji} **${args}**` } });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		}

		// This will add the success emoji as the prefix and then send the args
		success(args) {
			try {
				let emoji;
				if (this.channel.type == 'dm') {
					emoji = "<:yea:813181281265254460>";
				} else {
					emoji = this.channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS') ? "<:yea:813181281265254460>" : ':white_check_mark:';
				}
				return this.channel.send({ embed:{ color:"GREEN", description:`${emoji} **${args}**` } });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		}

	}
	return CustomMessage;
});