//web API implementation for MySQL DBs

var connection = require("./api/connection.js"); //instantiate connection provider
connection.createPool(); //initiate connection pool

var app = require("./api/app.js").app; //create Express application

var router = require("./api/router.js");
router.route(app, connection);

//app.use("/", require("./api/routes/new.js").router(connection)); //add router to app