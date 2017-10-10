var express = require("express");
var conf = require("../../conf/default.json").mysql;

/**
 * Get all the available table descriptions in the database.
 * @function tables
 */

exports.router = function(connection) {

    var router = express.Router();

    var get = express.Router();
    get.post("/get", function(req, res) {
		//table list request
        connection.query("SHOW TABLES;", {}, setTableNames(connection, res, conf.database));
    });
    router.use("/tables", get);


    return router;
}


var setTableNames = function(connection, res, db) {

    return {
        json: function(obj) {
            var tempObject = {
                tables: []
            };
            var size = obj.data.length;
            for (i = 0; i < obj.data.length; i++) {
                var table = obj.data[i]["Tables_in_" + db];
				//table description request
                connection.query("DESCRIBE " + table + " ;", {}, setTableDescription(connection, res, tempObject, table, size));
            }
        }
    }
}

var setTableDescription = function(connection, res, tempObject, table, size) {
    return {
        json: function(obj) {
            var tableDescription = {
                name: table,
                fields: obj.data
            };
			//foreign keys request
            connection.query("SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = '" + table + "' AND REFERENCED_TABLE_NAME IS NOT NULL;", {}, setForeignKeys(res, tempObject, tableDescription, size));
        }
    }
}

var setForeignKeys = function(res, tempObject, tableDescription, size) {
    return {
        json: function(obj) {

			//add foreign key information if the table has foreign keys
            if (tableDescription.fields) {
                for (i1 = 0; i1 < obj.data.length; i1++) {
                    for (i2 = 0; i2 < tableDescription.fields.length; i2++) {
						//add the foreign key data to the field object if it matches with some of the table columns
                        if (tableDescription.fields[i2].Field == obj.data[i1].COLUMN_NAME) {
                            tableDescription.fields[i2].ForeignKey = obj.data[i1];
                        }
                    }
                }
            }

            tempObject.tables.push(tableDescription);

            if (tempObject.tables.length == size) {
                //when all tables have been added
                res.json(tempObject);
            }
        }
    }
}
