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

        if (!port) throw 'No port defined';

        if (custom404) {
            fs.readFile("./" + custom404, function (err, data) {
                if (!err) {
                    err404 = data;
                }
            });
        }

        console.log('Server starts');

        server = http.createServer();

        server.on("request", function (request, response) {
            var url = request.url || INDEX;
            if (url === "/") url = INDEX;
            console.log("Received request", url);

            fs.readFile("./" + url, function (err, data) {
                if (err) {
                    response.statusCode = 404;
                    err404 = err404 || err.toString();
                    response.end(err404);
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
