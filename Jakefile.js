/*global desc, task, jake, fail, complete */
"use strict";

desc("Default build task");
task("default", ["lint"], function () {
    console.log("\n\nBuild OK");
});

desc("Lint everything");
task("lint", [], function () {
    console.log ("Lint is running");

    var lint = require("./build/lint/lint_runner.js");

    var list = new jake.FileList();
    list.include("**/*.js");
    list.exclude("node_modules");

    var options = {
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

    var globals = {
        describe: false,
        it: false,
        beforeEach: false,
        afterEach: false
    };

    lint.validateFileList(list.toArray(), options, globals);
});