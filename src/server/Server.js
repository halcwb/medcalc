/**
 * Created by halcwb on 05/06/15.
 */

"use strict";

(function () {
    var INDEX = "index.html";

    var http = require("http");
    var fs = require("fs");

    var server;
    var started = false;

    exports.start = function (port, custom404) {
        var err404;
        // Port has to be defined
        if (!port) throw 'No port defined';

        // Setup custom 404 page
        if (custom404) {
            fs.readFile("./" + custom404, function (err, data) {
                if (!err) {
                    err404 = data;
                } else {
                    throw err;
                }
            });
        }

        // Create a server instance
        server = http.createServer();

        // Setup server request response
        server.on("request", function (request, response) {
            var url = request.url || INDEX;
            if (url === "/") url = INDEX;
            console.log("Received request", url);

            serveFile(response, url, err404);
        });

        // Start the server
        console.log('Server starts');
        server.listen(port);
        started = true;
    };

    exports.stop = function (callback) {
        console.log('Server is closing');
        if (server && started) {
            started = false;
            callback = callback || function () {};
            server.close(callback);
        } else {
            throw "Server was not started or already closed";
        }
    };


    var serveFile = function (response, file, notFound) {
        fs.readFile("./" + file, function (err, data) {
            if (err) {
                response.statusCode = 404;
                response.end(notFound || err.toString());
            } else {
                response.end(data);
            }
        });
    };


})();
