const fs = require('fs')
const path = require('path')

const procedures = require('./descriptions')
const commons = require('../commons')

const connection = require('../../api/dbConnection.js') // instantiate connection provider

// Mocks the Response object from Express (for this file's purposes at least)
var response = {
  json: function (arg) {
    generate(arg.data)
  }
}

let callback
let dir
let exceptions
let configuration

exports.set = function (_configuration) {
  configuration = _configuration
}

var exportedMain = function (_callback) {
  const config = configuration.generator.procedures
  const dbConfig = configuration.mysql
  exceptions = config.exceptions
  dir = path.join(__dirname, '../../api/routes/gen/procedures/')
  callback = _callback
  connection.createPool(configuration) // initiate connection pool
  // Remove existing dir to avoid existing folders to be shown if new exceptions exist
  fs.rmdir(dir, { recursive: true }, function () {
    procedures.getProcedures(connection, response, dbConfig.database)
  })
}
exports.generate = exportedMain

// Main function
function generate (procedures) {
  if (!procedures.length) {
    console.log('No procedures found. Skipping...')
    process.nextTick(callback)
    return
  }
  commons.mkdirp(dir)
  for (let i1 = 0; i1 < procedures.length; i1++) {
    (() => {
      var procedure = procedures[i1]
      for (let i2 = 0; i2 < exceptions.length; i2++) {
        if (procedures[i1].name === exceptions[i2]) {
          return
        }
      }
      commons.saveToFile(routeCode(procedure), dir + procedure.name + '.js', i1 === procedures.length - 1, callback)
    })()
  }
  console.log('Procedures generation done.')
}

// Create query
function query (name, fields) {
  var statement = 'CALL ' + name + '( '
  for (let i = 0; i < fields.length; i++) {
    statement += ':V_' + fields[i].name
    if (i !== fields.length - 1) {
      statement += ', '
    }
  }
  statement += ' )'

  return statement
}

// Generate javascript code for routes
function routeCode (procedure) {
  var js = ''

  function add (line) {
    js += line + '\n'
  }

  add('const express = require(\'express\')')
  add('/**')
  add(' * @function ' + procedure.name)
  for (let i = 0; i < procedure.parameters.length; i++) {
    var temp = ' * @param {' + procedure.parameters[i].type + '} ' + procedure.parameters[i].name
    add(temp)
  }
  add(' */\n')
  add('exports.router = function (connection) {')
  add('  const router = express.Router()')
  add('  router.post(\'/procedures/' + procedure.name + '\', function (req, res) {')
  add('    connection.query(\'' + query(procedure.name, procedure.parameters) + '\', req.body, res)')
  add('  })')
  add('  return router')
  add('}')

  return js
}
