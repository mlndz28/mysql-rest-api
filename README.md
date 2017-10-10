Simple MySQL api
============

Usage
============

Install the dependencies with
~~~bash
	$ npm install
~~~

and start the api with
~~~bash
	$ npm start
~~~

The request are x-www-formurlencoded, and all of them are POST.
For the services generated with the crud generator the paths are \<database name\>:

/add
-----

The values to be inserted should go in the form (the columns name must match in order to be included in the query).

/get
-----

The values in the form are the filters (WHERE) of a select statement. Only matching column names are accepted. In case of not specifying any value in the form, the whole table is returned.

/update
-----

The form should come with two type of values, the filters and the values that are going to be updated. The filters have the prefix 'f_', while the updated values don't.

/delete
-----

The values in the form are the filters (WHERE) of a delete statement

Service generation
=======================

The api must be running.
~~~bash
	$ cd generator && node crud.js
~~~

Then restart the api to access the new services.

Documentation generation
=======================

Requires jsdoc.
~~~bash
	$ ./docs.sh
~~~
