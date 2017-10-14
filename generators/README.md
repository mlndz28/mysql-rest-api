Generators
============

The generators use either one of the APIs designed for MySQL data retrieval. Most of the logic consists in getting information from the system tables to procedurally generate code that can be used as a frame for the API.

crud
-----

Generates code for an Express application (specifically for this one, but can be used by adapting a connection object to make the queries).
The queries are pretty simple, but flexible as well in the matter of using filters.

procedures
-----

Makes a file for each of the procedures found on the database, each file have a connection call for the procedure and a path defined on the Express API.
