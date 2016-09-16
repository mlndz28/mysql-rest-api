var mysql = require("mysql");
var pool;

exports.createPool = function () {
    this.pool = mysql.createPool({ //create new connection pool
        connectionLimit: 101,
        host: "localhost",
        port: "3306",
        user: "mlndz",
        password: "colacho",
        database: "newTest"
    });

    this.pool.config.connectionConfig.queryFormat = function (query, values) { //so we can use prepared statements with the format :label instead of ?
        if (!values) return query;
        var temp = query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                //console.log(this.escape(values[key]));
                return this.escape(values[key]);
            } else {
                return '';
            }
            return txt;
        }.bind(this));
        console.log(temp);
        return temp;
    };
}

exports.query = function (statement, body, res) { //@param statement: MySQL query;@param body: object with input data
    var resObject = new Object();

    this.pool.getConnection(function (err, connection) {
        if (err) { //if can't connect to DB
            resObject["error"] = err;
            res.json(resObject);
        } else {

            connection.query(statement, body, function (err, results) {
                connection.release(); //as it's not being used anymore
                if (!err) {
                    resObject["error"] = "none";
                    resObject["data"] = results;
                } else { //if query can't be executed
                    resObject["error"] = err;
                    console.log("error");
                }
                res.json(resObject);
            });
        }
    });
}