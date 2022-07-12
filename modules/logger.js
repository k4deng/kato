/*
Logger class for easy and aesthetically pleasing console logging 
*/
const config = require("../config.js");
const chalk = require("chalk");
const moment = require("moment");
if (config.fileLogging == true) 
  var log = require("simple-node-logger").createRollingFileLogger({
    logDirectory: "./data/logs",
    fileNamePattern: "roll-<DATE>.log",
    dateFormat: "YYYY.MM.DD",
  });

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      if (config.fileLogging == true) log.info(content);
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`);
    }
    case "warn": {
      if (config.fileLogging == true) log.warn(content);
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
    }
    case "error": {
      if (config.fileLogging == true) log.error(content);
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content}`);
    }
    case "debug": {
      if (config.fileLogging == true) log.debug(content);
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
    }
    case "cmd": {
      if (config.fileLogging == true) log.info(content);
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case "ready": {
      if (config.fileLogging == true) log.info(content);
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");