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
        var url = "";
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
        getHttp(url, testResponse, processError);
    };


    exports.test_serverServesFile = function (test) {
        var testDir = "generated/test";
        var testFile = testDir + "/test.html";
        var testData = "This is data from a file";

        fs.writeFileSync(testFile, testData);
        test.ok(fs.existsSync(testFile), "File [" + testFile + "] should have been created");

        // Make a request
        var testResponse =  function (response, data) {
            // Check the status code
            test.equals(200, response.statusCode);
            test.equals(testData, data, 'Expected response received');
            test.done();
        };

        var processError = function (e) {
            // Fail test when error
            console.log('Got error:' + e.message);

            fs.unlinkSync(testFile);
            test.ok(!fs.existsSync(testFile), "Could not delete test file [" + testFile + "]");

            test.fail(e);
            test.done();
        };

        // Run the test
        getHttp(testFile, testResponse, processError);

    };

    exports.test_serverReturns404ForNonExistingUrl = function (test) {
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

})();

