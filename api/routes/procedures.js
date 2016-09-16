var express = require("express");

exports.router = function (connection) {

	var router = express.Router();

	var get = express.Router();
	get.post("/get", function (req, res) {
		connection.query("SHOW PROCEDURE STATUS;", req.body, getProcedureNames(connection, res));

	});
	router.use("/procedures", get);


	return router;
}


var getProcedureNames = function (connection, res) {
	
	return {
		json: function (obj) {
			var procedures = [];
			obj.data.forEach(function (item) {
				procedures.push(item.Name);
				connection.query("SHOW PROCEDURE "+item.Name+" ;", {}, getProcedureDescriptions);
			});
			console.log(procedures);


		}
	}
}

var getProcedureDescriptions = {
	json: function (obj) {
		var descriptions = [];
		/*obj.data.forEach(function (item) {
			procedures.push(item.Name);
			connection.query("SHOW PROCEDURE :proc;", {proc:item.Name}, getProcedureDescriptions);
		});*/
		console.log(JSON.stringify(obj.data));


	}
}

//consultor2.prepare("SHOW CREATE PROCEDURE "+tempObj.getString("ROUTINE_NAME")).doQuery();
