/**
 * Get all the available table descriptions in the database.
 * @function tables
 */

/**
 * Ask the table descriptions.
 * @memberOf tables
 * @param {Object} connection - MySQL connection
 * @param {Object} res - Express response
 * @param {String} db - Database name
 */
var getTables = function (connection, res, db) {
  connection.query('SHOW TABLES;', {}, setTableNames(connection, res, db))
}

exports.getTables = getTables

/**
 * @memberOf tables
 * @private
 */

var setTableNames = function (connection, res, db) {
  return {
    json: function (obj) {
      if (obj.error !== 'none') {
        process.exit()
      }
      var tempObject = {
        tables: []
      }
      var size = obj.data.length
      if (!obj.data.length) {
        res.json(tempObject)
      };
      for (let i = 0; i < obj.data.length; i++) {
        var table = obj.data[i]['Tables_in_' + db]
        // table description request
        connection.query('DESCRIBE `' + table + '` ;', {}, setTableDescription(connection, res, tempObject, table, size))
      }
    }
  }
}

/**
 * @memberOf tables
 * @private
 */

var setTableDescription = function (connection, res, tempObject, table, size) {
  return {
    json: function (obj) {
      var tableDescription = {
        name: table,
        fields: obj.data
      }
      // foreign keys request
      connection.query("SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = '" + table + "' AND REFERENCED_TABLE_NAME IS NOT NULL;", {}, setForeignKeys(res, tempObject, tableDescription, size))
    }
  }
}

/**
 * @memberOf tables
 * @private
 */

var setForeignKeys = function (res, tempObject, tableDescription, size) {
  return {
    json: function (obj) {
      // add foreign key information if the table has foreign keys
      if (tableDescription.fields) {
        for (let i1 = 0; i1 < obj.data.length; i1++) {
          for (let i2 = 0; i2 < tableDescription.fields.length; i2++) {
            // add the foreign key data to the field object if it matches with some of the table columns
            if (tableDescription.fields[i2].Field === obj.data[i1].COLUMN_NAME) {
              tableDescription.fields[i2].ForeignKey = obj.data[i1]
            }
          }
        }
      }

      tempObject.tables.push(tableDescription)

      if (tempObject.tables.length === size) {
        // when all tables have been added
        res.json(tempObject)
      }
    }
  }
}
