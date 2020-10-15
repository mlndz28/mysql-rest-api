/**
 * Web API implementation for MySQL DBs
 * @author Fabian Melendez fabian.melendez.a@gmail.com
 */

exports.set = function (_configuration) {
  exports.configuration = _configuration
}

exports.start = function () {
  const logger = require('./api/logger.js') // logging for our API
  logger.bind()
  const connection = require('./api/dbConnection.js') // instantiate connection provider
  connection.createPool(exports.configuration) // initiate connection pool
  const app = require('./api/app.js').app // create Express application
  const router = require('./api/router.js') // main router
  router.route(app, connection) // add the router to app and route all paths
}
