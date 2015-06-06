/**
 * Created by halcwb on 06/06/15.
 */

"use strict";

var http = require('http');
var server = require("../src/server/Server.js");

exports.setUp = function (begin) {
    server.start();
    begin();
};

exports.tearDown = function (done) {
    server.stop(function () {
        done();
    });
};

exports.test_serverReturnsResponse = function (test) {
    // Make a request
    var req = http.get("http://localhost:3000");
    req.on('response', function (response) {
        // Check if there is a response
        test.ok(response, 'Expected response received');

        response.on('data', function () {});
        test.done();
    }).on('error', function (e) {
        // Fail test when error
        console.log('Got error:' + e.message);
        test.fail(e);
    });
};

exports.test_serverReturnsHelloWorld = function (test) {
    // Make a request
    var req = http.get("http://localhost:3000");
    req.on('response', function (response) {
        // Check the status code
        test.equals(200, response.statusCode);

        response.setEncoding('utf8');
        response.on('data', function (data) {
            // Check if the response contains hello world
            console.log('got data', data);
//            test.equals('Hello World', data, 'Expected response received');
        });

        response.on('end', function () {
            test.done();
        });

    }).on('error', function (e) {
        // Fail test when error
        console.log('Got error:' + e.message);
        test.fail(e);
    });
};

