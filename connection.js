exports.query = function (pool, statement, body, res) {
	var result = new Object();

	pool.getConnection(function (err, connection) {
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