/**
 * Created by halcwb on 03/09/15.
 */


(function () {
    "use strict";

    var shell = require("shelljs");
    var cmd = "./apls-cli 2 json";
    var _ = require("underscore");

    shell.cd("./bin");
    shell.exec(cmd, { silent: true, async: false}, function (code, output) {
        _.each(output.split('\n'), function (r) {
           if (r) console.log(JSON.parse(r));
        });
    });


})();