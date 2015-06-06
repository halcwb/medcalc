/**
 * Created by halcwb on 06/06/15.
 */

"use strict";

var server = require("../src/server/Server.js");

exports.numberIsThree = function (test) {
    var number = server.getNumber();
    test.equals(number , 3, 'number');
    test.done();
};