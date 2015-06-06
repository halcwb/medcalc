/*global desc, task, jake, fail, complete */
"use strict";

(function () {
    desc("Default build task");
    task("default", ["lint", "test"], function () {
        console.log("\n\nBuild OK");
    });

    desc("Lint everything");
    task("lint", [], function () {
        console.log("Lint is running");

        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var pass = lint.validateFileList(files.toArray(), getOptions(), getGlobals());
        if (!pass) fail("Lint failed");
    });

    desc("Test everything");
    task("test", [], function () {
        console.log("Tests go here");
    });

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("Integrate");
        console.log("1. Make sure git status is clean and can be pulled from integration box");
        console.log("2. Build on integration box");
        console.log("  a. Open integration box");
        console.log("  b. git pull");
        console.log("  c. jake");
        console.log("  d. If jake fails, stop! Start over!");
        console.log("3. git checkout integration");
        console.log("4. git merge master --no-ff --log");
        console.log("5. git checkout master");

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
