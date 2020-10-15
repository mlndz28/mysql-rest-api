const path = require('path')

/** @module router */

/**
 * Routes all paths contained in routes folder to main app.
 * @param app - Express app
 * @param connection - DB connection
 */
exports.route = function (app, connection) {
  const files = getFiles(path.join(__dirname, 'routes'))
  files.forEach(function (file) {
    addToApp(file, app, connection)
  })
}

/**
 * Routes single file.
 * @param {String} path - File name with the router
 */
function addToApp (path, app, connection) {
  app.use('/api/', require(path).router(connection))
}

/**
 * Get all files on first level from folder.
 * @param {String} dir - Folder path
 */

function getFiles (dir) {
  const filesystem = require('fs')
  const results = []

  filesystem.readdirSync(dir).forEach(function (file) {
    const stat = filesystem.statSync(dir + '/' + file)

    if (!stat.isDirectory()) {
      results.push(dir + '/' + file)
    } else {
      const subresults = getFiles(dir + '/' + file)
      for (let i = 0; i < subresults.length; i++) {
        results.push(subresults[i])
      }
    }
  })

  return results
};
