/**
 * Created by halcwb on 17/06/15.
 */

(function () {
    "use strict";

    var PORT = '8082';

    var http = require("http");
    var spawn = require("child_process").spawn;
    var proc;

    exports.setUp = function (begin) {
        runServer(begin);
    };

    exports.tearDown = function (done) {
        proc.on('exit', function (code, signal) {
            done();
        });

        proc.kill('SIGTERM');
    };

    exports.test_canGetHomePage = function (test) {
        var testResponse = function (response, data) {
            test.equals(200, response.statusCode);
            test.ok(data.indexOf('medcalc') !== -1);
            test.done();
        };

        var processError = function (err) {
            test.fail(err.toString());
            test.done();
        };

        getHttp("", testResponse, processError);
    };

    exports.test_canGet404Page = function (test) {
        var testResponse = function (response, data) {
            test.equals(404, response.statusCode);
            test.ok(data.indexOf('404 page not found') !== -1);
            test.done();
        };

        var processError = function (err) {
            test.fail(err.toString());
            test.done();
        };

        getHttp("foobar", testResponse, processError);
    };


    var runServer = function (callback) {
        proc = spawn("node",  ["./src/server/Start.js", PORT]);

        proc.stdout.setEncoding('utf8');

        proc.stdout.on('data', function (chunk) {
            if (chunk.indexOf('medcalc online') !== -1) callback();
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