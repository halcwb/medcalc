/**
 * Created by halcwb on 06/06/15.
 */

(function () {
    "use strict";

    var PORT = '3000';
    var TESTDIR = "generated/test";

    var http = require('http');
    var server = require("../../src/server/Server.js");

    var fs = require('fs');


    exports.test_startWithoutPortThrowsException = function (test) {
        server.stop(function () {
            test.throws(function () {
                // Server is stopped and restarted
                // without a port
                server.start();
            });
            // Restart server so tearDown can stop the server
            server.start(PORT);
            test.done();
        });
    };


    exports.test_stopBeforeStartThrowsException = function (test) {
        server.stop(function () {
            test.throws(function () {
                // Server is stopped and
                // cannot be stopped again
                server.stop();
            });
            // Restart server so teardown can
            // stop the server
            server.start(PORT);
            test.done();
        });
    };


    exports.test_returnsResponse = function (test) {
        // Test the response
        var testResponse = function (response /*, data*/) {
            // Check if there is a response
            test.ok(response, 'Expected response received');
            test.done();
        };
        // Process the error
        var processError = function (e) {
            // Fail test when error
            console.log('Got error:' + e.message);
            test.fail(e);
            test.done();
        };
        // Run the test
        getHttp("", testResponse, processError);
    };


    exports.test_servesFile = function (test) {
        var testFile = TESTDIR + "/test.html";
        var expectedData = "This is data from a file";

        // Create a test file with expected data
        fs.writeFileSync(testFile, expectedData);
        test.ok(fs.existsSync(testFile), "File [" + testFile + "] should have been created");

        // Make a request
        var testResponse =  function (response, data) {
            // Clean up test file
            fs.unlinkSync(testFile);
            test.ok(!fs.existsSync(testFile), "Could not delete test file [" + testFile + "]");

            // Check the status code
            test.equals(200, response.statusCode);
            test.equals(expectedData, data, 'Expected response received');
            test.done();
        };

        // Process a possible error
        var processError = function (e) {
            // Clean up test file
            fs.unlinkSync(testFile);
            test.ok(!fs.existsSync(testFile), "Could not delete test file [" + testFile + "]");

            test.fail(e);
            test.done();
        };

        // Run the test
        getHttp(testFile, testResponse, processError);

    };


    exports.test_returns404ForNonExistingUrl = function (test) {
        // Test the response
        var testResponse = function (response /*, data */) {
            // Check the status code, should return a 404
            test.equals(404, response.statusCode);
            test.done();

        };

        // Process an error
        var processError =  function (e) {
            // Should not get an error
            test.fail(e);
            test.done();
        };

        // Run the test
        getHttp("foobar", testResponse, processError);
    };

    exports.test_canServeCustom404Page =function (test) {
        var custom404 = TESTDIR + "/custom404.html";
        var expectedData = "This is a custom 404 page";

        // Create a custom 404 file with expected data
        fs.writeFileSync(custom404, expectedData);
        test.ok(fs.existsSync(custom404), "File [" + custom404 + "] should have been created");

        server.stop(function () {
            server.start(PORT, custom404);

            var testResponse = function (response, data) {
                test.equals(404, response.statusCode);
                test.equals(expectedData, data);

                test.done();

                // Clean up test file
                fs.unlinkSync(custom404);
                test.ok(!fs.existsSync(custom404), "Could not delete test file [" + custom404 + "]");
            };

            // Process an error
            var processError =  function (e) {
                // Should not get an error
                test.fail(e);
                test.done();

                // Clean up test file
                fs.unlinkSync(custom404);
                test.ok(!fs.existsSync(custom404), "Could not delete test file [" + custom404 + "]");
            };

            // Run the test
            getHttp("foobar", testResponse, processError);
        });
    };

    exports.setUp = function (begin) {
        server.start(PORT, '', begin);
    };

    exports.tearDown = function (done) {
        server.stop(done);
    };


    var request = function (file) { return http.get('http://localhost:' + PORT + "/" + file); };


    var getHttp = function (url, testResponse, processError) {
        var req = request(url);
        var data = "";
        req.on('response', function (response) {
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                data += chunk;
            });

            response.on('end', function () {
                testResponse(response, data);
            });

        }).on('error', function (e) {
            // Fail test when error
            console.log('Got error:' + e.message);
            processError(e);
        });
    };

})();

