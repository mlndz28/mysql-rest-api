var express = require("express");
var cli = require("cli");

var conf = require("../server").configuration.express;

/**
 * Start the API
 * @constructor
 */
function app() {
	var app = express(); //start API

	process.on('uncaughtException', function(err) {
		if (err) {
			switch (err.code) {
				case "EADDRINUSE":
					cli.error("The port is already taken.");
					break;
			}
		}
		process.exit();
	});


	app.use(function(req, res, next) {
		console.log("[" + req.method + "]"+ (req.method.length > 5 ? "\t":"\t\t") + req.url);
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});


	var bodyParser = require('body-parser'); //in order to get body content from requests
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.listen(conf.port); //port set on conf file

	console.info("Server running on port " + conf.port + ".");
	return app;
}

exports.app = app();
