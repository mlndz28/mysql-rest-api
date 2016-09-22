var express = require("express");

/**
 * Example
 */

exports.router = function (connection) {
	var router = express.Router();
	router.post("/insert", function (req, res) {
		connection.query("CALL p_A_djent (:doesit, :ofcourseitdoes)", req.body, res);
	});
	return router;
}