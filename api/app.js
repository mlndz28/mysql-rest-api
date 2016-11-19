var express = require("express");

var conf = require("../conf/default.json").express;

/**
 * Start the API
 * @constructor
 */
function app() {
	var app = express(); //start API
	console.info("Server running on port " + conf.port + ".");
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});


	var bodyParser = require('body-parser') //in order to get body content from requests
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.listen(conf.port); //port set on conf file
	return app;
}

exports.app = app();