/**
 * Created by halcwb on 17/06/15.
 */

(function () {
    "use strict";

    var PORT = '8081';

    var http = require("http");
    var process = require("child_process");


    exports.test_smokeTest = function (test) {
        var testResponse = function (response) {
            console.log('test response');
            test.equals(200, response.statusCode);
            test.done();
        };

        var processError = function (err) {
            console.log('process error');
            test.fail(err.toString());
            test.done();
        };

        runServer();

        setTimeout(function ()  {
            getHttp("", testResponse, processError);
        }, 1000);
    };

    var runServer = function () {
        var run = process.spawn("node",  ["./src/server/Start.js"], {detached: true});

        run.stdout.on('data', function () {});
        run.stderr.on('data', console.log);

        run.on('close', function () {});
    };


    // ToDo: Duplicate
    var request = function (file) { return http.get('http://localhost:' + PORT + "/" + file); };

    // ToDo: Duplicate
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