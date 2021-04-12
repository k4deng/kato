module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  
  // This loop ensures that client.application always contains up to date data
  // about the app's status. This includes whether the bot is public or not,
  // its description, owner(s), etc. Used for the dashboard amongs other things.
  client.application = await client.fetchApplication();
  if (client.owners.length < 1) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  setInterval( async () => {
    client.owners = [];
    client.application = await client.fetchApplication();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 60000);

  // Make the bot status "Watching" which is the help command with default prefix.
  client.user.setActivity(`${client.settings.get("default").prefix}help`, {type: "WATCHING"});
  
  //link the api's for the website and stuff
  try {
    require('../modules/dashboard')(client);
		//require('../http/api')(client);
	} catch (err) {
		console.log(err);
  }

  // Were gonna go and set the bots nickname to "[prefix] JiroBot" with the correct prefix for each server its in.
  /*const guildsArray = client.guilds.cache.map(guild => guild.id);
  for (let i = 0; i < guildsArray.length; i++){
    try {
      const guild = client.guilds.cache.get(guildsArray[i]);
      const prefix = client.settings.get(`${guildsArray[i]}`).prefix || client.settings.get("default").prefix;
      
      if (client.settings.get(`${guildsArray[i]}`).prefix){
        const prefix = client.settings.get(`${guildsArray[i]}`).prefix;
      } else {
        const prefix = client.settings.get("default").prefix;
      }
      
      //guilds.cache.array()[i].me.setNickname(`[${prefix}] JiroBot`)
      console.log(prefix)
    } catch (e) {
      console.log(e);
      return;
    }
  };*/
};
