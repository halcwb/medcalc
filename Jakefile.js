/*global desc, task, jake, fail, complete, directory */
"use strict";

(function () {

    var GENERATED = "generated";
    var TEMP_TEST_DIR = GENERATED + "/test";

    var NODE_VERSION =  "v0.12.4";

    directory(TEMP_TEST_DIR);

    desc("Remove all generated files");
    task("clean", [], function () {
        jake.rmRf(GENERATED);
    });


    desc("Default build task");
    task("default", ["lint", "test"], function () {
        console.log("\n\nBuild OK\n");
    });

    desc("Lint everything");
    task("lint", ["node"], function () {
        console.log("\n\nLint is running\n");

        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var pass = lint.validateFileList(files.toArray(), getOptions(), getGlobals());
        if (!pass) fail("Lint failed");
    });

    desc("Test everything");
    task("test", ["node", TEMP_TEST_DIR], function () {
        console.log("\n\nStart testing");
        var reporter = require("nodeunit").reporters.default;
        reporter.run(['test'], null, function (failures) {
                if (failures) fail('tests fail!', failures);
                complete();
            }
        );
    }, {async: true});

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("\n\nIntegrate (master is last known good build)");
        console.log("1. Make sure git status is clean");
        console.log("2. git push origin development");
        console.log("3. Build on integration box");
        console.log("  a. Open integration box");
        console.log("  b. Make sure it's on the development branch");
        console.log("  c. git pull");
        console.log("  d. ./jake.sh");
        console.log("  e. If jake fails, stop! Start over!");
        console.log("4. git checkout master");
        console.log("5. git merge development --no-ff --log");
        console.log("5. git push origin master");
        console.log("6. git checkout development");
    });

    // desc("Check node version");
    task("node", [], function () {
        console.log("\nChecking node version\n");

        sh("node --version", function (version) {
            if (version.trim() !== NODE_VERSION) {
                fail("Not the right version: " + version +
                    "should be: " + NODE_VERSION);
            }
            complete();
        });

    }, {async: true});


    function sh(cmd, callback) {
        console.log("> " + cmd);
        var process = jake.createExec([cmd], {printStderr: true});
        process.addListener('stdout', function (buffer) {
            var version = buffer.toString('ascii');
            callback(version);
        });
        process.run();
    }


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
