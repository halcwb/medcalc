/**
 * Created by halcwb on 06/06/15.
 * Use to quickly demonstrate basic http get actions
 */
"use strict";

var http = require('http');

http.get("http://www.google.com/index.html", function (res) {
    console.log("Got response" + res.statusCode);
}).on("error", function (e) {
    console.log("Got error:" + e.message);
});