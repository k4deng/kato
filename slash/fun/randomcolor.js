const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const randomColor = require("randomcolor");
const Canvas = require("canvas");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const advancedMode = interaction.options.get("advanced")?.value; 
  
  const seed = `${Math.random()}`;
  
  const hex = randomColor({ seed: seed, format: "hex" });
  const rgbArray = randomColor({ seed: seed, format: "rgbArray" });
  const hsvArray = randomColor({ seed: seed, format: "hsvArray" });
  const hslArray = randomColor({ seed: seed, format: "hslArray" });

  // init canvas
  let canvas;
  if (advancedMode) canvas = Canvas.createCanvas(152, 152);
  else canvas = Canvas.createCanvas(152, 180);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // color
  context.fillStyle = hex;
  context.fillRect(12, 12, 128, 128);
  // text
  if (!advancedMode) {
    context.font = "bold 22px Regular";
    context.fillStyle = "#3a3a3a";
    context.fillText(hex.toUpperCase(), 10, canvas.height - 12);
  }
  
  // generate attachment
  const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `${hex.substring(1)}.png` });

  // make embed
  const embed = new EmbedBuilder()
    .setColor(hex);
  if (advancedMode) {
    embed.setThumbnail(`attachment://${hex.substring(1)}.png`);
    embed.addFields(
      { name: "HEX", value: hex },
      { name: "RGB", value: `${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}` },
      { name: "HSV", value: `${hsvArray[0]}°, ${hsvArray[1]}%, ${hsvArray[2]}%` },
      { name: "HSL", value: `${hslArray[0]}°, ${hslArray[1]}%, ${hslArray[2]}%` },
    );
  }
  else embed.setImage(`attachment://${hex.substring(1)}.png`);
  
  // reply interaction
  await interaction.reply({ embeds: [embed], files: [attachment] });
};

exports.commandData = {
  name: "randomcolor",
  description: "Generates a random color.",
  category: "Fun",
  options: [{
    name: "advanced",
    type: ApplicationCommandOptionType.String,
    description: "Show more details about random color.",
    required: false,   
    choices: [{
      name: "True",
      value: "true"
    }]
  }],
  dmPermission: true,
  defaultMemberPermissions: null
};

exports.conf = {
  permLevel: "User"
};