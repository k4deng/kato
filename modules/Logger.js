/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require("chalk");
const moment = require("moment");
const	log = require('simple-node-logger').createRollingFileLogger({
  logDirectory: './data/logs',
  fileNamePattern: 'roll-<DATE>.log',
  dateFormat: 'YYYY.MM.DD',
});

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case 'log':
      log.info(content);
      console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
      break;
    case 'warn':
      log.warn(content);
      console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      break;
    case 'error':
      log.error(content);
      console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      break;
    case 'debug':
      log.debug(content);
      console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      break;
    case 'cmd':
      log.info(content);
      console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      break;
    case 'ready':
      log.info(content);
      console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      break;
    default:
      throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
