## Modules

<dl>
<dt><a href="#module_app">app</a></dt>
<dd></dd>
<dt><a href="#module_dbConnection">dbConnection</a></dt>
<dd></dd>
<dt><a href="#module_logger">logger</a></dt>
<dd></dd>
<dt><a href="#module_router">router</a></dt>
<dd></dd>
</dl>

<a name="module_app"></a>

## app

* [app](#module_app)
    * [~app](#module_app..app)
        * [new app()](#new_module_app..app_new)

<a name="module_app..app"></a>

### app~app
**Kind**: inner class of [<code>app</code>](#module_app)  
<a name="new_module_app..app_new"></a>

#### new app()
Starts the Express API

**Returns**: <code>app</code> - Express application  
<a name="module_dbConnection"></a>

## dbConnection

* [dbConnection](#module_dbConnection)
    * _static_
        * [.createPool(configuration)](#module_dbConnection.createPool)
        * [.query(statement, body, res)](#module_dbConnection.query)
    * _inner_
        * [~parseQuery(statement, values)](#module_dbConnection..parseQuery)
        * [~connect(statement, body, connection, res)](#module_dbConnection..connect)
        * [~onError(err, values)](#module_dbConnection..onError)

<a name="module_dbConnection.createPool"></a>

### dbConnection.createPool(configuration)
Creates new connection pool.

**Kind**: static method of [<code>dbConnection</code>](#module_dbConnection)  

| Param | Type | Description |
| --- | --- | --- |
| configuration | <code>Object</code> | Contains the parameters to connect to the database. |

<a name="module_dbConnection.query"></a>

### dbConnection.query(statement, body, res)
Gets a connection from the pool and makes a request.

**Kind**: static method of [<code>dbConnection</code>](#module_dbConnection)  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | MySQL query |
| body | <code>Object</code> | Input data |
| res |  | Express response |

<a name="module_dbConnection..parseQuery"></a>

### dbConnection~parseQuery(statement, values)
New format for prepared statements, replaces the usual "?":
* :V_<label> (values) replaces with value associated to key matched with the label.
* :C (columns) replaces with escaped names of columns separated by commas, key must be 'columns'. Ex: `{columns:"name1,name2,name3"}` -> <code>"\`name1\`,\`name2\`,\`name3\`"</code>.
* :OU (object unrestricted) replaces with escaped object separated by AND. On empty objects, returns 1. Ex: `{yes: "no", no: "yes"}`-> <code>"\`yes\` = 'no' AND \`no\` = 'yes'"</code>. `{}` -> `"1"`.
* :OR (object restricted) replaces with escaped object separated by AND. On empty objects, returns empty string. Ex: `{yes: "no", no: "yes"}`-> <code>"\`yes\` = 'no' AND \`no\` = 'yes'"</code>.
* :OF (object filter) replaces with escaped object values with keys preceded by f_ separated by AND. On empty objects, returns empty string. Ex: `{"f_yes": "no", "f_no": "yes"}` -> <code>"`yes` = 'no' AND `no` = 'yes'"</code>.
* :OC (object commas) replaces with escaped object values separated by commas. On empty objects, returns empty string. Ex: `{yes: "no", no: "yes"}` -> <code>"`yes` = 'no', `no` = 'yes'"</code>.
This way objects can be used as parameters for querys.

**Kind**: inner method of [<code>dbConnection</code>](#module_dbConnection)  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | MySQL query to be parsed |
| values | <code>Object</code> | Values to be inserted on the statement |

<a name="module_dbConnection..connect"></a>

### dbConnection~connect(statement, body, connection, res)
Makes requests to DB.

**Kind**: inner method of [<code>dbConnection</code>](#module_dbConnection)  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | MySQL query |
| body | <code>Object</code> | Input data |
| connection |  | From pool |
| res |  | Express response |

<a name="module_dbConnection..onError"></a>

### dbConnection~onError(err, values)
Error handling.

**Kind**: inner method of [<code>dbConnection</code>](#module_dbConnection)  

| Param | Type | Description |
| --- | --- | --- |
| err |  | Error from mysql |
| values | <code>Object</code> | Express response |

<a name="module_logger"></a>

## logger

* [logger](#module_logger)
    * _static_
        * [.bind()](#module_logger.bind)
    * _inner_
        * [~toSTDOUT(data)](#module_logger..toSTDOUT)
        * [~toFile(data, type)](#module_logger..toFile)

<a name="module_logger.bind"></a>

### logger.bind()
Overrides console methods to export data to log files.

**Kind**: static method of [<code>logger</code>](#module_logger)  
<a name="module_logger..toSTDOUT"></a>

### logger~toSTDOUT(data)
Standard console logging.

**Kind**: inner method of [<code>logger</code>](#module_logger)  

| Param | Description |
| --- | --- |
| data | Data entries. |

<a name="module_logger..toFile"></a>

### logger~toFile(data, type)
Write entry to log file.

**Kind**: inner method of [<code>logger</code>](#module_logger)  

| Param | Type | Description |
| --- | --- | --- |
| data |  | Data entries. |
| type | <code>String</code> | Entry's header. |

<a name="module_router"></a>

## router

* [router](#module_router)
    * _static_
        * [.route(app, connection)](#module_router.route)
    * _inner_
        * [~addToApp(path)](#module_router..addToApp)
        * [~getFiles(dir)](#module_router..getFiles)

<a name="module_router.route"></a>

### router.route(app, connection)
Routes all paths contained in routes folder to main app.

**Kind**: static method of [<code>router</code>](#module_router)  

| Param | Description |
| --- | --- |
| app | Express app |
| connection | DB connection |

<a name="module_router..addToApp"></a>

### router~addToApp(path)
Routes single file.

**Kind**: inner method of [<code>router</code>](#module_router)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File name with the router |

<a name="module_router..getFiles"></a>

### router~getFiles(dir)
Get all files on first level from folder.

**Kind**: inner method of [<code>router</code>](#module_router)  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>String</code> | Folder path |

