exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const flip = Math.round(Math.random()) > 0.5 ? "Its Heads!" : "Its Tails!";
  await interaction.reply({ content: flip });  
};

exports.commandData = {
  name: "flip",
  description: "Flips a coin.",
  category: "Fun",
  options: [],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};