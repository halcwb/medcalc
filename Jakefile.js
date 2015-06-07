/*global desc, task, jake, fail, complete */
"use strict";

(function () {

    var NODE_VERSION =  "v0.12.4";

    desc("Default build task");
    task("default", ["lint", "test"], function () {
        console.log("\n\nBuild OK");
    });

    desc("Lint everything");
    task("lint", ["node"], function () {
        console.log("Lint is running");

        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var pass = lint.validateFileList(files.toArray(), getOptions(), getGlobals());
        if (!pass) fail("Lint failed");
    });

    desc("Test everything");
    task("test", ["node"], function () {
        console.log("Start testing");
        var reporter = require("nodeunit").reporters.default;
        reporter.run(['test'], null, function (failures) {
                if (failures) fail('tests fail!', failures);
                complete();
            }
        );
    }, {async: true});

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("Integrate (master is last good build)");
        console.log("1. Make sure git status is clean");
        console.log("2. Push development to origin");
        console.log("3. Build on integration box");
        console.log("  a. Open integration box");
        console.log("  b. git pull from development from origin");
        console.log("  c. jake");
        console.log("  d. If jake fails, stop! Start over!");
        console.log("4. git checkout master");
        console.log("5. git merge development --no-ff --log");
        console.log("6. git checkout development");
    });

    // desc("Check node version");
    task("node", [], function () {
        console.log("Checking node version");
        var exc = jake.createExec(['node --version']);
        exc.addListener('stdout', function (buffer) {
            var version = buffer.toString('ascii');
            if (version.trim() !== NODE_VERSION) {
                fail("Not the right version: " + version +
                "should be: " + NODE_VERSION);
            }
            complete();
        });
        exc.run();
    }, {async: true});

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
