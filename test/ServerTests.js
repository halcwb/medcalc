/**
 * Created by halcwb on 06/06/15.
 */

"use strict";

var http = require('http');
var server = require("../src/server/Server.js");

exports.tearDown = function (done) {
    server.stop(function () {
        done();
    });
};

exports.testHttpServerIsCreated = function (test) {
    server.start();
    // Make a request
    http.get("http://localhost:3000", function (response) {
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

