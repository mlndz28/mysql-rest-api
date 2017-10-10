var express = require("express");

/**
 * Example
 */

exports.router = function (connection) {
	var router = express.Router();
	router.post("/folk", function (req, res) {
		connection.query("SELECT * FROM Musician", req.body, res);
	});
	return router;
}
