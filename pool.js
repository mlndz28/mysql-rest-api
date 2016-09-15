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

pool.config.queryFormat = function (query, values) {
	if (!values) return query;
	return query.replace(/\:(\w+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return this.escape(values[key]);
		}
		return txt;
	}.bind(this));
};

console.log("Initializing server...");
var app = express(); //start framework
//app.use(express.bodyParser());
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


console.log("Getting connection to DB...");


var router = express.Router(); //new module for 'app'

router.post("/", function (req, res) {
	query(pool, "SELECT * from djent", res);
	console.log(req.body);

});
app.use("/new", router); //add router to app

var router2 = express.Router();


var damn = "bloaaaa";
router2.get("/", function (req, res) {
	//console.log(req);
	//console.log(res);
	console.log(damn);
});
app.use("/ex", router2); //add router to app
app.listen(port);

//connection.end();

/*pool.on('connection', function (connection) {
	console.log("nuuuuuu connection");
});*/


function query(pool, statement, res) {
	var result = new Object();

	pool.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			result["error"] = err;
			res.json(result);
		} else {
			connection.query(statement, function (err, rows, fields) {
				if (!err) {
					console.log("User: ", connection.threadId);
					result["error"] = "none";
					result["data"] = rows;
				} else {
					result["error"] = err;
					console.log("error");
				}
				res.json(result);
				connection.release();
			});
		}
	});
}


/*function djent(pool) {
	
	var conn = getConn(pool);
	conn.query("SELECT * from djent", function (err, rows, fields) {
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

function getConn(pool) {
	var retconnection;

	pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			res.json = new Object()["error"] = err;
		}

		console.log("User: ", connection.threadId);
		retconnection = connection;
	});
	console.log("User outside: ", connection.threadId);

	return retconnection;
}*/
