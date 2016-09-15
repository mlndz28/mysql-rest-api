var express = require("express");

var connection = require("./connection.js"); //instantiate connection provider
connection.createPool(); //initiate connection pool

var app = require("./app.js").app; //create Express application

app.use("/", require("./routes/new.js").router(connection)); //add router to app