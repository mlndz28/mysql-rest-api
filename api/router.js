exports.route = function (app, connection) {

    addToApp = function (path) {
        app.use("/", require("./routes/" + path).router(connection));
    }

    //add routes into "route" folder, this will add them to the app
    var files = getFiles("./api/routes");
    files.forEach(function (file) {
        addToApp(file);
    });

}

/*
 *  To get all files on first level from routes folder
 */

function getFiles(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        var stat = filesystem.statSync(dir + '/' + file);

        if (!stat.isDirectory()) {
            results.push(file);
        }

    });

    return results;

};