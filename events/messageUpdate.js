//this is for the editrevive command

module.exports = async (client, message) => {
  //ignore bots because we dont care about their message edits
  if (message.author.bot) return;

  //dont save edits in dm's so we dont clog up database
  if (!message.guild) return;

  //now save the author, channel, and message
  client.revivedata.set(`editrevive_${message.channel.id}`, {
		content: message.content,
		author: message.author
	});

};
