var express = require("express");

/**
 * Example
 */

exports.router = function (connection) {
	var router = express.Router();
	router.post("/new", function (req, res) {
		connection.query("SELECT * FROM djent WHERE doesit = :doesit", req.body, res);
	});
	return router;
}