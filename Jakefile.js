desc("Default build task");
task("default", ["lint"], function () {
    console.log("\n\nBuild OK");
});

desc("Lint everything");
task("lint", [], function () {
    console.log ("Lint is running");
    var lint = require("./build/lint/lint_runner.js");
    lint.validateFile("Jakefile.js", {}, {});

    var list = new jake.FileList();
    list.include("**/*.js");
    list.exclude("node_modules");
    lint.validateFileList(list, {
        node: true
    }, {});
});