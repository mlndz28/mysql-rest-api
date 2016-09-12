var express = require("express");
var mysql = require("mysql");

var port = 2828;

var pool = mysql.createPool({ //connection to db
	connectionLimit: 100,
	host: "10.0.0.23",
	port: "3306",
	user: "root",
	password: "2347771",
	database: "modelador_flujos"
});

console.log("Initializing server...")
var app = express(); //start framework


console.log("Getting connection to DB...")


var router = express.Router(); //new module for 'app'
router.get("/", function (req, res) {
	getUsers(pool, res);
});
app.use("/new", router); //add router to app
app.listen(port);

//connection.end();

function getUsers(pool, res) {
	console.log("yes");
	var rowsResponse = new Object();

	pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			rowsResponse["error"] = err;
		}

		console.log("User: ", connection.threadId);

		connection.query("SELECT * from MfF_Usuarios", function (err, rows, fields) {
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
}
