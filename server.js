/**
 * Web API implementation for MySQL DBs
 * @author Fabian Melendez fabian.melendez.a@gmail.com
 */

var logger = require("./api/logger.js"); //logging for our API
logger.bind();

var connection = require("./api/dbConnection.js"); //instantiate connection provider
connection.createPool(); //initiate connection pool

var app = require("./api/app.js").app; //create Express application

var router = require("./api/router.js"); //main router
router.route(app, connection); //add the router to app and route all paths