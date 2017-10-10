var http = require('http');
var fs = require('fs');
var config = require('../conf/default.json').generator.procedures;

var requestStatus;
var options = config.request;
var exceptions = config.exceptions;
var dir = config.routesDir;

// Request to api/routes/tables (service must be up)
http.request(options, function (res) {
	if (res.statusCode != 200) {
		console.log("Error retrieving data");
		console.log(res	);
	}

	var whole = "";
	res.on('data', function (chunk) {
		whole += chunk;

	});
	res.on('end', function () {
		generate(JSON.parse(whole).data);
	});
}).end();

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
	console.log("Saving " + procedure + ".js");
	fs.createWriteStream(dir + "/" + procedure + ".js", { //write into file
		flags: 'w',
		autoClose: true,
		fd: null,
	}).write(code);
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
