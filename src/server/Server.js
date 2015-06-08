/**
 * Created by halcwb on 05/06/15.
 */

"use strict";

(function () {
    var http = require("http");
    var server;
    var started = false;

    exports.start = function (port) {
        if (!port) throw 'No port defined';
        console.log('Server starts');

        server = http.createServer();

        server.on("request", function (request, response) {
            console.log("Received request");

            response.end('Hello World');
        });

        server.listen(port);
        started = true;
    };

    exports.stop = function (callback) {
        console.log('Server is closing');
        if (server && started) {
            started = false;
            server.close(callback);
        } else {
            throw "Server was not started or already closed";
        }
    };

})();
