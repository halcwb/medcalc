/*global desc, task, jake, fail, complete */
"use strict";

(function () {
    desc("Default build task");
    task("default", ["lint"], function () {
        console.log("\n\nBuild OK");
    });

    desc("Lint everything");
    task("lint", [], function () {
        console.log("Lint is running");

        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        lint.validateFileList(files.toArray(), getOptions(), getGlobals());
    });

    function getOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: true
        };
    }

    function getGlobals() {
        return {
            describe: false,
            it: false,
            beforeEach: false,
            afterEach: false
        };
    }
})();
