var http = require('http');
var fs = require('fs');
var procedures = require('../api/routes/procedures');
var config = require('../conf/default.json').generator.procedures;
var dbConfig = require('../conf/default.json').mysql;

var connection = require("../api/dbConnection.js"); //instantiate connection provider
connection.createPool(); //initiate connection pool

var requestStatus;
var options = config.request;
var exceptions = config.exceptions;
var dir = config.routesDir;

//Mocks the Response object from Express (for this file's purposes at least)
var response = {
	json: function(arg){
		generate(arg.data);
	}
};

procedures.getProcedures(connection, response, dbConfig.database);

// Main function
function generate(procedures) {
	mkdirp(dir);
	for (i1 = 0; i1 < procedures.length; i1++) {
		it: {
			var procedure = procedures[i1];
			for (i2 = 0; i2 < exceptions.length; i2++) {
				if (procedures[i1].name == exceptions[i2]) {
					break it;
				}
			}
			saveToFile(routeCode(procedure), procedure.name);
		}
	}
	console.log("\nProcedures generation done.\n");
}

// Create query
function query(name, fields) {
	var statement = "CALL "+ name + "( ";
	for(i = 0; i < fields.length; i++){

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
	console.log("Generating route for", procedure.name);
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
	add("	router.post(\"/"+procedure.name+"\", function (req, res) {");
	add("		connection.query(\"" + query(procedure.name, procedure.parameters) + "\", req.body, res);");
	add("	});");
	add("	return router;");
	add("}");

	return js;
}

// Write code into a file
function saveToFile(code, procedure) {
	ws = fs.createWriteStream(dir + "/" + procedure + ".js", { //write into file
		flags: 'w',
		autoClose: true,
		fd: null,
	});
	ws.write(code);
	ws.end(function(){process.exit()});
}

// Create a directory along with its parents (in case they don't exist)
function mkdirp(path){
	var folders = path.split("/");
	var parentBuild = "";

	console.log("Creating gen directory");
	for( i = 0; i < folders.length; i++ ){
		parentBuild += folders[i]+"/";
		try {
			//create folder if it doesn't exist
			fs.mkdirSync(parentBuild);
		} catch (e) {
			//expected exception in case it exists
			if (e.code != "EEXIST") {
				data = e.toString();
			}
		}
	}
}
