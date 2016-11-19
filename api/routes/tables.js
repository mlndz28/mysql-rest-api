var express = require("express");
var conf = require("../../conf/default.json").mysql;

/**
 * Get all the available table descriptions in the database.
 * @function tables
 */

exports.router = function (connection) {

	var router = express.Router();

	var get = express.Router();
	get.post("/get", function (req, res) {
		connection.query("SHOW TABLES;", {}, getTableNames(connection, res, conf.database));

	});
	router.use("/tables", get);


	return router;
}


var getTableNames = function (connection, res, db) {

	return {
		json: function (obj) {
			var tempObject = {
				tables: []
			};
			var size = obj.data.length;
			for (i = 0; i < obj.data.length; i++) {
				var table = obj.data[i]["Tables_in_" + db];
				connection.query("DESCRIBE " + table + " ;", {}, getTableDescription(res, tempObject, table, size));
			}
		}
	}
}

var getTableDescription = function (res, tempObject, table, size) {
	return {
		json: function (obj) {
			tempObject.tables.push({
				name: table,
				fields: obj.data
			});
			if (tempObject.tables.length == size) {
				//when all tables have been added
				res.json(tempObject);
			}
		}
	}
}