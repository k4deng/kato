//this is for the revive command

module.exports = async (client, message) => {
  //ignore bots because we dont care about when they delete messages
  if (message.author.bot) return;

  //dont save deletes in dm's so we dont clog up database
  if (!message.guild) return;

  //now save the author, channel, and message
  client.revivedata.set(`revive_${message.channel.id}`, {
		content: message.content,
		author: message.author
	});

};
