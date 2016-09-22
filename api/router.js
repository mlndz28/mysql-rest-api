/**
 * Routes all paths contained in routes folder to main app.
 * @param app - Express app
 * @param connection - DB connection
 */
exports.route = function (app, connection) {

	/**
	 * Routes single file.
	 * @param {String} path - File name with the router
	 */
	addToApp = function (path) {
		app.use("/", require("./routes/" + path).router(connection));
	}

	var files = getFiles("./api/routes");
	files.forEach(function (file) {
		addToApp(file);
	});

}

/**
 * Get all files on first level from folder.
 * @param {String} dir - Folder path
 */

function getFiles(dir) {

	var filesystem = require("fs");
	var results = [];

	filesystem.readdirSync(dir).forEach(function (file) {

		var stat = filesystem.statSync(dir + '/' + file);

		if (!stat.isDirectory()) {
			results.push(file);
		}

	});

	return results;

};