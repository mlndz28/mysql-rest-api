var express = require("express");
var conf = require("../../conf/default.json").mysql;

/**
 * Get all the available procedure descriptions in the database.
 * @function procedures
 */

exports.router = function (connection) {

	var router = express.Router();

	var get = express.Router();
	get.post("/get", function (req, res) {
		getProcedures(connection, res, conf.database);
	});
	router.use("/procedures", get);

	return router;
}

/**
 * Ask the db information about the stored procedures.
 * @memberOf procedures
 * @param {Object} connection - MySQL connection
 * @param {Object} res - Express response
 * @param {String} db - Database name
 */
var getProcedures = function(connection, res, db) {
	connection.query("SHOW PROCEDURE STATUS WHERE Db = '" + db + "';", {}, getProcedureNames(connection, res));
}

exports.getProcedures = getProcedures;

/**
 * @memberOf procedures
 * @private
 */

var getProcedureNames = function (connection, res) {

	return {
		json: function (obj) {
				if(obj.error != "none"){
				res.json({data: [], error: obj.error});
				return;
			}
			var data = [];

			for (i = 0; i < obj.data.length; i++) {
				var procedure = {};
				procedure.name = obj.data[i].Name;
				connection.query(	"SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE FROM information_schema.parameters WHERE SPECIFIC_NAME = :V_objName;",
									{objName: procedure.name},
									getProcedureDescriptions(res, data, procedure, obj.data.length));
			}
		}
	}
}

/**
 * @memberOf procedures
 * @private
 */
var getProcedureDescriptions = function (res, data, procedure, returnSize) {
	return {
		json: function (obj) {

			procedure.parameters = [];
			for (var i = 0; i < obj.data.length; i++) {
				procedure.parameters.push({"name": obj.data[i].PARAMETER_NAME, "type": obj.data[i].DATA_TYPE, "io": obj.data[i].IPARAMETER_MODE});
			}
			data.push(procedure);

			if (data.length == returnSize) {
				res.json({data: data, error: null});
			}
		}
	}
}
