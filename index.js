var express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({ //connection to db
	host: "10.0.0.23",
	port: "3306",
	user: "root",
	password: "2347771",
	database: "modelador_flujos"
});

console.log("Initializing server...")
var app = express(); //start framework
var router = express.Router();


console.log("Getting connection to DB...")
connection.connect();
router.get("/", function (req, res) {
	getUsers(connection, res);
});
app.use("/new", router);
app.listen(2828);

//connection.end();

function getUsers(connection, res) {
	console.log("yes");
	var rowsResponse = new Object();
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
	//console.log(rowsResponse);
	//return rowsResponse;
}
