var express = require("express");

exports.router = function (connection) {
    var router = express.Router();
    router.post("/folk", function (req, res) {
        connection.query("CALL p_A_folk (:int, :dec, :bool)", req.body, res);
    });
    return router;
}