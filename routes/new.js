var express = require("express");

exports.router = function (connection) {
    var router = express.Router(); //this will be added to an Express app
    router.post("/new", function (req, res) {
        connection.query("SELECT * from djent WHERE doesit = :doesit", req.body, res);
        console.log(req.body);
    });
    return router;
}