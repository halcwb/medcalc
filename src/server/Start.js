(function () {
    "use strict";

    var server = require("./Server.js");
    var port = process.argv[2] || 8081;

    server.start(port, "notFoundPage.html", function () {
        console.log('medcalc online on: ', port);
    });

})();