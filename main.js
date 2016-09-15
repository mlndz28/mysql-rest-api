var express = require("express");

var pool = require("./pool.js").pool;
var connection = require("./connection.js");
var app = require("./app.js").app;

/* put routes into separate files */

var router = express.Router(); //new module for 'app'

router.post("/", function (req, res) {
	connection.query(pool, "SELECT * from djent WHERE doesit = :doesit", req.body, res);
	console.log(req.body);

});

app.use("/new", router); //add router to app
