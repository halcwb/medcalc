/**
 * Created by halcwb on 06/06/15.
 */

"use strict";

var assert = require('assert');
var server = require("../src/server/Server.js");

exports.numberIsThree = function (test) {
    var number = server.getNumber();
    assert.equal(3, number, 'number');
//    test.equals(number , 3, 'number');
    test.done();
};