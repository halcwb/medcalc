/**
 * Created by halcwb on 17/06/15.
 */

(function () {
    "use strict";

    var PORT = '8081';

    var http = require("http");
    var spawn = require("child_process").spawn;
    var proc;

    exports.setUp = function (begin) {
        runServer(begin);
    };

    exports.tearDown = function (done) {
        proc.on('exit', function (code, signal) {
            console.log('process stopped with', code, signal);
            done();
        });

        proc.kill('SIGTERM');
    };

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

        getHttp("", testResponse, processError);
    };

    var runServer = function (callback) {
        proc = spawn("node",  ["./src/server/Start.js"]);

        proc.stdout.setEncoding('utf8');

        proc.stdout.on('data', function (chunk) {
            if (chunk.trim() === 'medcalc online') callback();
        });

        proc.stderr.on('data', console.log);

        proc.on('close', function () {});
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