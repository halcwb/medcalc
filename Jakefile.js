desc("Default build task");
task("default", ["lint"], function () {
   console.log("\n\nBuild OK");
});

desc("Lint everything");
task("lint", [], function () {
   console.log ("Lint is running");
   var lint = require("./build/lint/lint_runner.js");
   lint.validateFile("Jakefile.js", {}, {});
});