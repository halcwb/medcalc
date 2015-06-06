/**
 * Created by halcwb on 05/06/15.
 */

"use strict";

var http = require("http");
var server;

exports.start = function () {
    console.log('Server starts');

    server = http.createServer();

    server.on("request", function (request, response) {
        console.log("Received request");

        response.end('test');
    });

    server.listen(3000);
};

exports.stop = function (callback) {
    console.log('Server is closing');
    server.close(callback);
};