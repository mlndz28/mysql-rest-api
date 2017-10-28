var cli = require("cli");
var fs = require('fs');

/**
 * Common variables for the generators.
 * @function commons
 */


/**
 * Create and write into a file.
 * @memberOf commons
 * @param {String} 	code - File's content
 * @param {String} 	path - Path of the file to be created/written
 * @param {Boolean} last - When true execute the callback
 * @param {Function} callback - Called at the end of the write
 */
exports.saveToFile = function(code, path, last, callback) {
	ws = fs.createWriteStream(path, { //write into file
		flags: 'w',
		autoClose: true,
		fd: null,
	});
	ws.write(code);
	if (last) {
		ws.end(callback)
	};
}

/**
 * Create a directory along with its parents (in case they don't exist)
 * @memberOf commons
 * @param {String} path - Path of the folder to be created
 */
exports.mkdirp = function(path) {
	var folders = path.split("/");
	var parentBuild = "";
	for (i = 0; i < folders.length; i++) {
		parentBuild += folders[i] + "/";
		try {
			//create folder if it doesn't exist
			fs.mkdirSync(parentBuild);
		} catch (e) {
			//expected exception in case it exists
			if (e.code != "EEXIST") {
				cli.error(e);
			}
		}
	}
}
