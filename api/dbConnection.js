var mysql = require("mysql");
var conf = require("../conf/default.json").mysql;

var pool;

/**
 * Set up new connection pool. 
 * @constructor
 */

function dbConnection() {
	this.pool = mysql.createPool(conf); //create new connection pool
	this.pool.config.connectionConfig.queryFormat = parseQuery; //adds formatting to prepared statements
}

exports.createPool = dbConnection;

/**
 * Get connection from pool.
 * @memberof dbConnection
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
 * New format for prepared statements, new standards:
 * <pre>
 * :V_<label> (values) replaces with value associated to key matched with the label.
 * :C (columns) replaces with escaped names of columns separated by commas, key must be 'columns'. Ex: {columns:"name1,name2,name3"}->"`name1`,`name2`,`name3`".
 * :OU (object unrestricted) replaces with escaped object separated by AND. On empty objects, returns 1. Ex: {yes: "no", no: "yes"}->"`yes` = 'no' AND `no` = 'yes'". {} -> "1".
 * :OR (object restricted) replaces with escaped object separated by AND. On empty objects, returns empty string. Ex: {yes: "no", no: "yes"}->"`yes` = 'no' AND `no` = 'yes'".
 * :OF (object filter) replaces with escaped object values with keys preceded by f_ separated by AND. On empty objects, returns empty string. Ex: {"f_yes": "no", "f_no": "yes"}->"`yes` = 'no' AND `no` = 'yes'".
 * :OC (object commas) replaces with escaped object values separated by commas. On empty objects, returns empty string. Ex: {yes: "no", no: "yes"}->"`yes` = 'no', `no` = 'yes'".
 * </pre>
 * This way objects can be used as parameters for querys.
 * @memberof dbConnection
 * @param {String} statement - MySQL query to be parsed
 * @param {Object} values - Values to be inserted on the statement
 */

function parseQuery(statement, values) {
	//console.log("query0 = " + statement);
	if (!values) return statement;
	var temp = statement.replace(/\:V_(\w+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			if (values[key] == "") {
				return "' '";
			}
			if (values[key] == 1 || values[key] == 0) {
				return values[key];
			}
			return this.escape(values[key]);
		} else {
			return 'NULL';
		}
		return txt;
	}.bind(this));

	temp = temp.replace(/\:C/g, function (txt, key) {
		var parsed = "";
		if (values.hasOwnProperty("columns")) {
			var columns = values.columns.split(",");
			delete values.columns;
			for (i = 0; i < columns.length; i++) {
				parsed += '`' + columns[i].replace('`', '') + '`';
				if (i != columns.length - 1) {
					parsed += ','
				}
			}
			return parsed;
		} else {
			return '*';
		}
	}.bind(this));

	temp = temp.replace(/\:OF/g, function (txt, key) {
		var parsed = "";
		for (var param in values) {
			if (param.slice(0, 2) == "f_" && values.hasOwnProperty(param)) {
				parsed += '`' + param.replace(/`|f_/g, '') + "` = '";
				if (values[param] == 1 || values[param] == 0) {
					parsed += values[param] + "' AND ";
				} else {
					parsed += values[param].replace("'", '') + "' AND ";

				}
			}
		}

		return parsed.slice(0, parsed.length - 4);

	}.bind(this));


	temp = temp.replace(/\:OU/g, function (txt, key) {
		var parsed = "";
		for (var param in values) {
			if (values.hasOwnProperty(param)) {
				parsed += '`' + param.replace('`', '') + "` = '" + values[param].replace("'", '') + "' ";
				parsed += 'AND ';
			}
		}
		if (parsed == "") {
			return "1";
		}
		return parsed.slice(0, parsed.length - 4);

	}.bind(this));


	temp = temp.replace(/\:OR/g, function (txt, key) {
		var parsed = "";
		for (var param in values) {
			if (values.hasOwnProperty(param)) {
				parsed += '`' + param.replace('`', '') + "` = '" + values[param].replace("'", '') + "' ";
				parsed += 'AND ';
			}
		}
		return parsed.slice(0, parsed.length - 4);

	}.bind(this));

	temp = temp.replace(/\:OC/g, function (txt, key) {
		var parsed = "";
		for (var param in values) {
			if (param.slice(0, 2) != "f_" && values.hasOwnProperty(param)) {
				parsed += '`' + param.replace('`', '') + "` = '" + values[param].replace("'", '') + "' ";
				parsed += ', ';
			}
		}
		return parsed.slice(0, parsed.length - 2);

	}.bind(this));


	console.log("query1 = " + temp);
	return temp;

}

/**
 * Make request to DB.
 * @memberof dbConnection
 * @param {String} statement - MySQL query
 * @param {Object} body - Input data
 * @param connection - From pool 
 * @param res - Express response
 */

function onConnect(statement, body, connection, res) {
	connection.query(statement, body, function (err, results) {
		console.log("in = " + JSON.stringify(body));
		//as it's not being used anymore
		connection.release();
		if (!err) {
			var resObject = new Object();
			resObject["error"] = "none";
			resObject["data"] = results;
			console.log("out = " + JSON.stringify(resObject));
			res.json(resObject);
		} else {
			//if query can't be executed
			onError(err, res);
		}
		return resObject;
	});
}

/**
 * Error handling.
 * @memberof dbConnection
 * @param err - Error from mysql
 * @param {Object} values - Express response
 */

function onError(err, res) {
	console.error("out =" + err);
	res.json({
		error: err
	});
}