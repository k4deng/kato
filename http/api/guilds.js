// Dependecies
const express = require('express'),
	router = express.Router();

// Command page
module.exports = function(client) {
	// Show list of commands
	router.get('/:guildId', async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildId);
		if (guild) {
			const { id, name, icon, members: { size } } = guild;
			const userMembers = guild.members.cache.filter(m => !m.user.bot).size;
			const botMembers = guild.members.cache.size - userMembers;
			return res.status(200).json({ id, name, icon, totalMembers: size, userMembers, botMembers });
		}
		res.status(400).json({ error: 'Guild not found!' });
	});

	return router;
};
