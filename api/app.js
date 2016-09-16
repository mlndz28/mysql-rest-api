var express = require("express");

var conf = require("../conf/default.json").express;

function app() {
    var app = express(); //start API
    console.info("Initializing server on port "+conf.port+".");

    var bodyParser = require('body-parser')	//in order to get body content from requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.listen(conf.port);	//port set on conf file
    return app;
}

exports.app = app();