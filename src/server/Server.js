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
    var notFoundFile;

    exports.start = function (port, custom404, callback) {
        var url;
        notFoundFile = custom404;
        // Port has to be defined
        if (!port) throw 'No port defined';

        // Create a server instance
        server = http.createServer();

        // Setup server request response
        server.on("request", function (request, response) {
            url = request.url || INDEX;
            if (url === "/") url = INDEX;

            serveFile(response, url);
        });

        // Start the server
        server.listen(port, callback);
        started = true;
    };

    exports.stop = function (callback) {
        if (server && started) {
            started = false;
            callback = callback || function () {};
            server.close(callback);
        } else {
            throw "Server was not started or already closed";
        }
    };


    var serveFile = function (response, file, notFound) {
        fs.readFile("./" + file, { encoding: 'utf8' }, function (err, html) {
            if (err) {
                response.statusCode = 404;

                if (notFoundFile) {
                    fs.readFile("./" + notFoundFile, { encoding: 'utf8' }, function (err, notFound) {
                        if (err) {
                            throw err;
                        } else {
                            response.end(notFound);
                        }
                    });
                } else {
                    response.end(err.toString());
                }
            } else {
                response.end(html);
            }
        });
    };


})();
