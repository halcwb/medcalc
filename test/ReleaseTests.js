/**
 * Created by halcwb on 18/06/15.
 */

(function () {
    "use strict";

    var http = require("http");
    var fs = require('fs');


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



    // ToDo: Duplicate
    var request = function (file) { return http.get('http://informedica-medcalc.herokuapp.com' + "/" + file); };

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