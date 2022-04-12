const logger = require("../modules/logger.js");
const config = require("../config.js");

module.exports = async (client, error) => {
  if (config.debug) logger.debug(error);
};