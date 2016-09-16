var mysql = require("mysql");
var conf = require("../conf/default.json").mysql;

var pool;

exports.createPool = function () {
	this.pool = mysql.createPool(conf); //create new connection pool

	this.pool.config.connectionConfig.queryFormat = function (query, values) { //so we can use prepared statements with the format :label instead of ?
		if (!values) return query;
		var temp = query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) {
				return this.escape(values[key]);
			} else {
				return '';
			}
			return txt;
		}.bind(this));
		return temp;
	};
}

exports.query = function (statement, body, res) { //@param statement: MySQL query;@param body: object with input data
	var resObject = new Object();

	this.pool.getConnection(function (err, connection) {
		if (err) { //if can't connect to DB
			resObject["error"] = err;
			console.error("out =" + err);
			res.json(resObject);
		} else {

			connection.query(statement, body, function (err, results) {
				console.log("in = " + JSON.stringify(body));
				connection.release(); //as it's not being used anymore
				if (!err) {
					resObject["error"] = "none";
					resObject["data"] = results;
					console.log("out = " + JSON.stringify(resObject));
				} else { //if query can't be executed
					resObject["error"] = err;
					console.error("out = " + err);
				}
				res.json(resObject);
			});
		}
	});
}
