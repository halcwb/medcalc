"use strict";

var http = require('http');

var server = http.createServer();


server.on("request", function (request, response) {
    console.log("Received request");

    var body = "<html><head><title>Node Http Spike</title></head>" +
            "<body><p>This is a spike of Node's HTTP server.</p></html></html>";

    response.end(body);
});

server.listen(3000);

console.log('Server started');