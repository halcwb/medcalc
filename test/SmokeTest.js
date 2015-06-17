/**
 * Created by halcwb on 17/06/15.
 */

(function () {
    "use strict";

    var PORT = '3000';

    var http = require("http");


    exports.test_smokeTest = function (test) {
        test.fail("Smoke test fails");
        test.done();
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