var http = require('http');
var fs = require('fs');
var rmdir = require('rmdir');

var procedures = require('./descriptions');
var commons = require('../commons');

var connection = require("../../api/dbConnection.js"); //instantiate connection provider


//Mocks the Response object from Express (for this file's purposes at least)
var response = {
	json: function(arg) {
		generate(arg.data);
	}
};


var callback;
var dir;
var exceptions;
var configuration;

exports.set = function(_configuration) {
	configuration = _configuration;
};

var exportedMain = function(_callback) {
	var config = configuration.generator.procedures;
	var dbConfig = configuration.mysql;
	var options = config.request;
	exceptions = config.exceptions;
	dir = __dirname + "/../../api/routes/gen/procedures/";
	callback = _callback;
	connection.createPool(configuration); //initiate connection pool
	// Remove existing dir to avoid existing folders to be shown if new exceptions exist
	rmdir(dir, function(){
		procedures.getProcedures(connection, response, dbConfig.database);
	});
}
exports.generate = exportedMain;

// Main function
function generate(procedures) {
	if (!procedures.length) {
		console.log("No procedures found. Skipping...");
		process.nextTick(callback);
		return;
	}
	commons.mkdirp(dir);
	for (i1 = 0; i1 < procedures.length; i1++) {
		it: {
			var procedure = procedures[i1];
			for (i2 = 0; i2 < exceptions.length; i2++) {
				if (procedures[i1].name == exceptions[i2]) {
					break it;
				}
			}
			commons.saveToFile(routeCode(procedure), dir + procedure.name + ".js", i1 == procedures.length - 1, callback);
		}
	}
	console.log("Procedures generation done.")
}

// Create query
function query(name, fields) {
	var statement = "CALL " + name + "( ";
	for (i = 0; i < fields.length; i++) {

		statement += ":V_" + fields[i].name;
		if (i != fields.length - 1) {
			statement += ", ";
		}
	}
	statement += " );";

	return statement;
}

// Generate javascript code for routes
function routeCode(procedure) {
	var js = "";

	function add(line) {
		js += line + '\n';
	}

	add("var express = require(\"express\");");
	add("/**");
	add(" * @function " + procedure.name);
	for (i = 0; i < procedure.parameters.length; i++) {
		var temp = " * @param {" + procedure.parameters[i].type + "} " + procedure.parameters[i].name;
		add(temp);
	}
	add(" */\n");
	add("exports.router = function (connection) {");
	add("	var router = express.Router();");
	add("	router.post(\"/procedures/" + procedure.name + "\", function (req, res) {");
	add("		connection.query(\"" + query(procedure.name, procedure.parameters) + "\", req.body, res);");
	add("	});");
	add("	return router;");
	add("}");

	return js;
}
