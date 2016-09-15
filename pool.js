var mysql = require("mysql");

function pool() {
	var pool = mysql.createPool({ //connection to db
		connectionLimit: 101,
		host: "localhost",
		port: "3306",
		user: "mlndz",
		password: "colacho",
		database: "newTest"
	});
	
	pool.config.connectionConfig.queryFormat = function (query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) {
				return this.escape(values[key]);
			}
			return txt;
		}.bind(this));
	};
	
	return pool;
}

exports.pool = pool();