var mysql = require("mysql");
var conf = require("../conf/default.json").mysql;

var pool;

/**
 * Set up new connection pool. 
 * @constructor
 */

exports.createPool = function () {
	this.pool = mysql.createPool(conf); //create new connection pool
	this.pool.config.connectionConfig.queryFormat = parseQuery; //adds formatting to prepared statements
}


/**
 * Get connection from pool.
 * @param {String} statement - MySQL query
 * @param {Object} body - Input data
 * @param res - Express response
 */

exports.query = function (statement, body, res) { //;

	this.pool.getConnection(function (err, connection) {
		if (err) { //if can't connect to DB
			onError(err, res);
		} else {
			onConnect(statement, body, connection, res);
		}
	});
}

/**
 * New format for prepared statements, :label is the new standard.
 * This way objects can be used as parameters for querys.
 * @param {String} statement - MySQL query to be parsed
 * @param {Object} values - Values to be inserted on the statement
 */

function parseQuery(statement, values) {
	//gitconsole.log("query0 = " + statement);
	if (!values) return statement;
	var temp = statement.replace(/\:(\w+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return this.escape(values[key]);
		} else {
			return '';
		}
		return txt;
	}.bind(this));
	//console.log("query1 = " + temp);
	return temp;

}

/**
 * Make request to DB.
 * @param {String} statement - MySQL query
 * @param {Object} body - Input data
 * @param connection - From pool 
 * @param res - Express response
 */

function onConnect(statement, body, connection, res) {
	connection.query(statement, body, function (err, results) {
		console.log("in = " + JSON.stringify(body));
		connection.release(); //as it's not being used anymore
		if (!err) {
			var resObject = new Object();
			resObject["error"] = "none";
			resObject["data"] = results;
			console.log("out = " + JSON.stringify(resObject));
			res.json(resObject);
		} else { //if query can't be executed
			onError(err, res);
		}
		return resObject;
	});
}

/**
 * Error handling.
 * @param err - Error from mysql
 * @param {Object} values - Express response
 */

function onError(err, res) {
	console.error("out =" + err);
	res.json({
		error: err
	});
}