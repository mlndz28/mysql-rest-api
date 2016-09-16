var express = require("express");

exports.router = function (connection) {
    var router = express.Router();
    router.post("/new", function (req, res) {
        connection.query("CALL p_G_djent ('*', :ofcourseitdoes)", req.body, res);
    });
    return router;
}