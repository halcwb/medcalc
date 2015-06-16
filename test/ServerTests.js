/**
 * Created by halcwb on 06/06/15.
 */

(function () {
    "use strict";

    var PORT = '3000';

    var http = require('http');
    var server = require("../src/server/Server.js");

    var fs = require('fs');

    var request = function (file) { return http.get('http://localhost:' + PORT + "/" + file); };

    exports.setUp = function (begin) {
        server.start(PORT);
        begin();
    };

    exports.tearDown = function (done) {
        server.stop(done);
    };


    exports.test_serverStartWithoutPortThrowsException = function (test) {
        server.stop();
        test.throws(function () {
            server.start();
        });
        server.start(PORT);
        test.done();
    };


    exports.test_serverStopBeforeStartThrowsException = function (test) {
        server.stop();
        test.throws(function () {
            server.stop();
        });
        server.start(PORT);
        test.done();
    };

    exports.test_serverReturnsResponse = function (test) {
        // Make a request
        var req = request();
        req.on('response', function (response) {
            // Check if there is a response
            test.ok(response, 'Expected response received');

            response.on('data', function () {});
            test.done();
        }).on('error', function (e) {
            // Fail test when error
            console.log('Got error:' + e.message);
            test.fail(e);
            test.done();
        });
    };


    exports.test_serverServesFile = function (test) {
        var testDir = "generated/test";
        var testFile = testDir + "/test.html";
        var testData = "This is data from a file";

        fs.writeFileSync(testFile, testData);
        test.ok(fs.existsSync(testFile), "File [" + testFile + "] should have been created");


        // Make a request
        var req = request(testFile);
        req.on('response', function (response) {
            // Check the status code
            test.equals(200, response.statusCode);

            response.setEncoding('utf8');
            response.on('data', function (data) {
                // Check if the response contains hello world
                console.log('got data', data);
                test.equals(testData, data, 'Expected response received');
            });

            response.on('end', function () {
                test.done();
            });

        }).on('error', function (e) {
            // Fail test when error
            console.log('Got error:' + e.message);

            fs.unlinkSync(testFile);
            test.ok(!fs.existsSync(testFile), "Could not delete test file [" + testFile + "]");

            test.fail(e);
            test.done();
        });
    };

})();

