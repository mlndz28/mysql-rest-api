//web API implementation for MySQL DBs

var logger = require("./api/logger.js"); //logging for our API
logger.bind();

var connection = require("./api/connection.js"); //instantiate connection provider
connection.createPool(); //initiate connection pool

var app = require("./api/app.js").app; //create Express application

var router = require("./api/router.js"); //main router
router.route(app, connection); //add the router to app and route all paths
