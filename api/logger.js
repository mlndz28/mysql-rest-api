var fs = require('fs');
var util = require('util');

/**
 * Override console methods to export data to log files.
 * @constructor
 */

function logger() {
	console.log = function (data) {
		toFile(data, "log");
		toSTDOUT(data);
	};
	console.error = function (data) {
		toFile(data, "ERR");
		toSTDOUT(data);
	};
	console.warn = function (data) {
		toFile(data, "war");
		toSTDOUT(data);
	};
	console.info = function (data) {
		toFile(data, "inf");
		toSTDOUT(data);
	};
};
exports.bind = logger;

/**
 * Standard console logging.
 * @memberof logger
 * @param data - Data entries.
 */

function toSTDOUT(data) {
	process.stdout.write(util.format(data) + '\n'); //just pass data to stdout
}

/**
 * Write entry to log file.
 * @memberof logger
 * @param data - Data entries.
 * @param {String} type - Entry's header.
 */


function toFile(data, type) {
	var d = new Date();
	var dir = "./logs/" + d.getFullYear() + "_" + ("0" + (d.getMonth() + 1)).slice(-2) + "_" + ("0" + d.getDate()).slice(-2); //name of folder in which log files are gonna be stored, one per day

	try { //create folder if it doesn't exist
		fs.mkdirSync("./logs");
	} catch (e) {
		if (e.code != "EEXIST") { //expected exception in case it exists
			data = e.toString();
		}
	}

	try { //create folder if it doesn't exist
		fs.mkdirSync(dir);
	} catch (e) {
		if (e.code != "EEXIST") { //expected exception in case it exists
			data = e.toString();
		}
	}
	var file = +d.getFullYear() + "_" + ("0" + (d.getMonth() + 1)).slice(-2) + "_" + ("0" + d.getDate()).slice(-2) + "@" + ("0" + d.getHours()).slice(-2); //new file every hour
	fs.createWriteStream(dir + "/" + file, { //write into file (create if !exists) 
		flags: 'a',
		autoClose: true,
		fd: null,
	}).write("(" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + "." + (d.getMilliseconds() + "00").slice(0, 3) + ")[" + type + "]: " + util.format(data) + '\n');
}