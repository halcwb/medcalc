(function () {
    "use strict";

    var server = require("./Server.js");

    server.start(8081, "notFoundPage.html", function () {
        console.log('medcalc online');
    });

})();