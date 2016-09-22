var express = require("express");
var conf = require("../../conf/default.json").mysql;

/*
 * Get all the available table descriptions on the database. 
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
			for (i = 0; i < obj.data.length; i++) {
				var table = obj.data[i]["Tables_in_" + db];
				if (i == obj.data.length - 1) {
					connection.query("DESCRIBE " + table + " ;", {}, getTableDescription(res, tempObject, table, true));
				} else {
					connection.query("DESCRIBE " + table + " ;", {}, getTableDescription(res, tempObject, table, false));
				}
			}
		}
	}
}

var getTableDescription = function (res, tempObject, table, returnJson) {
	return {
		json: function (obj) {
			tempObject.tables.push({
				name: table,
				fields: obj.data
			});
			if (returnJson) {
				res.json(tempObject);
				console.log(tempObject);
			}
		}
	}
}