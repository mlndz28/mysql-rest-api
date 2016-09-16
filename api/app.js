var express = require("express");

var port = 2828;

function app() {
    var app = express(); //start framework
    console.log("Initializing server...");

    var bodyParser = require('body-parser')
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.listen(port);
    return app;
}

exports.app = app();