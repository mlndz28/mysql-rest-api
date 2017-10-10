/**
 * Routes all paths contained in routes folder to main app.
 * @constructor
 * @param app - Express app
 * @param connection - DB connection
 */
exports.route = function (app, connection) {

	/**
	 * Routes single file.
	 * @memberOf route
	 * @param {String} path - File name with the router
	 */
	addToApp = function (path) {
		app.use("/", require("." + path).router(connection));
	}

	var files = getFiles("./api/routes");
	files.forEach(function (file) {
		addToApp(file);
	});

}

/**
 * Get all files on first level from folder.
 * @memberof route
 * @param {String} dir - Folder path
 */

function getFiles(dir) {

	var filesystem = require("fs");
	var results = [];

	filesystem.readdirSync(dir).forEach(function (file) {

		var stat = filesystem.statSync(dir + '/' + file);

		if (!stat.isDirectory()) {
			results.push(dir + "/" + file);
		} else {
			subresults = getFiles(dir + "/" + file);
			for (i = 0; i < subresults.length; i++) {
				results.push(subresults[i]);
			}
		}

	});

	return results;

};
