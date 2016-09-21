var express = require("express");
var conf = require("../../conf/default.json").mysql;

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
				//tempObject.descriptions.push(connection.query("SHOW CREATE PROCEDURE " + item.Name + " ;", {}, getProcedureDescriptions(connection, res)).data['Create Procedure']);
				if (i == obj.data.length - 1) {
					connection.query("SHOW CREATE PROCEDURE " + procedures[i] + " ;", {}, getProcedureDescriptions(connection, res, tempObject, true));
				} else {
					connection.query("SHOW CREATE PROCEDURE " + procedures[i] + " ;", {}, getProcedureDescriptions(connection, res, tempObject, false));
				}
			}
			//console.log(procedures);
			//res.json(tempObject);


		}
	}
}

var getProcedureDescriptions = function (connection, res, tempObject, returnJson) {
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

//consultor2.prepare("SHOW CREATE PROCEDURE "+tempObj.getString("ROUTINE_NAME")).doQuery();