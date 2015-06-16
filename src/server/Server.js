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

    exports.start = function (port) {
        if (!port) throw 'No port defined';
        console.log('Server starts');

        server = http.createServer();

        server.on("request", function (request, response) {
            var url = request.url || INDEX;
            if (url === "/") url = INDEX;
            console.log("Received request", url);

            fs.readFile("./" + url, function (err, data) {
                if (err) {
                    response.statusCode = 404;
                    response.end(err.toString());
                } else {
                    response.end(data);
                }

            });
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
