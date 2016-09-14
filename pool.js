var express = require("express");
var mysql = require("mysql");

var port = 2828;

var pool = mysql.createPool({ //connection to db
	connectionLimit: 100,
	host: "localhost",
	port: "3306",
	user: "mlndz",
	password: "colacho",
	database: "newTest"
});

console.log("Initializing server...")
var app = express(); //start framework


console.log("Getting connection to DB...")


var router = express.Router(); //new module for 'app'
router.get("/", function (req, res) {
	djent(pool);
});
app.use("/new", router); //add router to app
app.listen(port);

//connection.end();

/*function getUsers(pool, res) {
	console.log("yes");
	var rowsResponse = new Object();

	pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			rowsResponse["error"] = err;
		}

		console.log("User: ", connection.threadId);

		connection.query("SELECT * from djent", function (err, rows, fields) {
			if (!err) {
				rowsResponse["error"] = "none";
				rowsResponse["data"] = rows;
			} else {
				rowsResponse["error"] = err;
				console.log("error");
			}
			res.json(rowsResponse);
		});
	});
	//console.log(rowsResponse);
	//return rowsResponse;
}*/

function djent(pool) {
	
	getConnection(pool).query("SELECT * from djent", function (err, rows, fields) {
		if (!err) {
			rowsResponse["error"] = "none";
			rowsResponse["data"] = rows;
		} else {
			rowsResponse["error"] = err;
			console.log("error");
		}
		res.json(rowsResponse);
	});
}

function getConnection(pool) {
	//var _connection;

	return pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			res.json = new Object()["error"] = err;
		}

		console.log("User: ", connection.threadId);
		return connection;
	});

	//return _connection;
}
