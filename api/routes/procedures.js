var express = require("express");
var conf = require("../../conf/default.json").mysql;

/*
 * Get all the available procedure descriptions on the database. 
 */

exports.router = function (connection) {

	var router = express.Router();

	var get = express.Router();
	get.post("/get", function (req, res) {
		connection.query("SHOW PROCEDURE STATUS WHERE Db = :Db;", {
			Db: conf.database
		}, getProcedureNames(connection, res));

	});
	router.use("/procedures", get);


	return router;
}


var getProcedureNames = function (connection, res) {

	return {
		json: function (obj) {
			var procedures = [];
			var tempObject = {
				procedures: procedures,
				descriptions: []
			};
			for (i = 0; i < obj.data.length; i++) {
				procedures.push(obj.data[i].Name);
				if (i == obj.data.length - 1) {
					connection.query("SHOW CREATE PROCEDURE " + procedures[i] + " ;", {}, getProcedureDescriptions(res, tempObject, true));
				} else {
					connection.query("SHOW CREATE PROCEDURE " + procedures[i] + " ;", {}, getProcedureDescriptions(res, tempObject, false));
				}
			}
		}
	}
}

var getProcedureDescriptions = function (res, tempObject, returnJson) {
	return {
		json: function (obj) {
			obj.data.forEach(function (item) {
				tempObject.descriptions.push(item["Create Procedure"]);
			});
			if (returnJson) {
				res.json(tempObject);
				console.log(tempObject);
			}
		}
	}
}