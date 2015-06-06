/**
 * Created by halcwb on 05/06/15.
 */

"use strict";

var http = require("http");
var server;

exports.start = function (port) {
    if (!port) throw 'No port defined';
    console.log('Server starts');

    server = http.createServer();

    server.on("request", function (request, response) {
        console.log("Received request");

        response.end('test');
    });

    server.listen(port);
};

exports.stop = function (callback) {
    console.log('Server is closing');
    if (server) server.close(callback);
};