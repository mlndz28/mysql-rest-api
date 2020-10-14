`mysql-rest-api` is a simple command-line REST api for MySQL databases. It can create a CRUD, or use other database features, as stored procedures, for data retrieval.

Simple MySQL api
============

Installation
============

Via npm:
-----

Install globally with
~~~bash
npm install --g mysql-rest-api
~~~


Usage
=====

~~~bash
mysql-rest-api [configuration file] [options]
~~~

If you didn't install it globally, you can use
~~~bash
npm run start -- [configuration file] [options]
~~~
from the repository folder.

Options
------

`--port` or `-p`		Port to use. The default value is 2828.		

`--connection-limit` 	The maximum number of connections to create at once. The default value is  100.

`--db-host`				The hostname of the database you are connecting to. The default value is ' localhost'.

`--db-port`				The port number of the database you are connecting to. The default value is 3306.

`--database`			Name of the database to use.

`--user` or `-u`		Database user. The default value is 'root'.

`--password`			Password for the database user.

`--help` or `-h`		Display the help chart.

`--skip-crud`			Do not create a crud.

`--skip-procedures`		Do not include stored procedures in the api.


api
======

The request are x-www-formurlencoded, and all of them are POST.

CRUD
------

The URL format goes by \<host\>:\<port\>/api/\<table\>, using the next HTTP verbs:

### POST

The values to be inserted should go in the form (the columns name must match in order to be included in the query).

### GET

The values in the form are the filters (WHERE) of a select statement. Only matching column names are accepted. In case of not specifying any value in the form, the whole table is returned.

### PUT

The form should come with two type of values, the filters and the values that are going to be updated. The filters have the prefix 'f_', while the updated values don't.

### DELETE

The values in the form are the filters (WHERE) of a delete statement

Procedures
------

The path format is \<host\>:\<port\>/api/procedures/\<procedure\>, and the procedures parameters go on the form with the same name they have in the database.

Configuration files
=======

If you don't want to put all the arguments via command-line, you can use a configuration file. This is useful for scripting.

The configuration files must be a JSON file with this structure:

~~~json
{
	"mysql": {
		"connectionLimit": 100,
		"host": "localhost",
		"port": "3306",
		"user": "<database user name>",
		"password": "<user's password for the database>",
		"database": "<database name>"

	},

	"express": {
		"port": 2828
	},

	"generator": {
		"crud": {
			"include": true,
			"exceptions": []
		},
		"procedures": {
			"include": false,
			"exceptions": []
		}
	}
}

~~~
