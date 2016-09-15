var mysql = require("mysql");
var pool;

exports.createPool = function () {
    this.pool = mysql.createPool({ //connection to db
        connectionLimit: 101,
        host: "localhost",
        port: "3306",
        user: "mlndz",
        password: "colacho",
        database: "newTest"
    });

    this.pool.config.connectionConfig.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
}

exports.query = function (statement, body, res) {
    var result = new Object();

    this.pool.getConnection(function (err, connection) {
        if (err) {
            result["error"] = err;
            res.json(result);
        } else {

            connection.query(statement, body, function (err, rows, fields) {
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