/*global desc, task, jake, fail, complete, directory */
"use strict";

(function () {

    var GENERATED = "generated";
    var TEMP_TEST_DIR = GENERATED + "/test";

    var BROWSERS = [
        'Chrome',
        'Safari',
        'Firefox',
        'IE'
    ];

    var NODE_VERSION =  "v0.12.4";

    directory(TEMP_TEST_DIR);


    desc("Remove all generated files");
    task("clean", [], function () {
        jake.rmRf(GENERATED);
    });


    desc("Deploy to Heroku");
    task("deploy", ["default"], function () {
        sh("git push heroku master", '', function () {
            console.log('Deployed to Heroku!');
        });
    });


    desc("Default build task");
    task("default", ["lint", "test", "clean"], function () {
        console.log("\n\nBuild OK\n");
    });


    desc("Lint everything");
    task("lint", ["lint-server", "lint-client"]);


    desc("Lint Server");
    task("lint-server", ["node-version"], function () {
        console.log("\n\nLint server is running\n");

        var validate = require("./build/lint/lint_runner.js").validateFileList;

        var pass = validate(getServerFiles(), getLintOptions_Node(), getGlobals());

        if (!pass) fail("Lint Server failed");
    });


    desc("Lint Client");
    task("lint-client", ["node-version"], function () {
        console.log("\n\nLint client is running\n");

        var validate = require("./build/lint/lint_runner.js").validateFileList;

        var pass = validate(getClientFiles(), getLintOptions_Browser(), getGlobals());

        if (!pass) fail("Lint Client failed");
    });


    desc("Test Everything");
    task("test", ["test-server", "test-client"]);


    desc("Start Karma");
    task("start-karma", [], function () {
        var message = 'starting karma failed';

        console.log("\n\nStart testing client\n");

        sh('node ./node_modules/karma/bin/karma start build/karma.conf.js', message, function (stdout) {
            if (stdout.indexOf(message) !== -1) fail(message);
            console.log(stdout);

            complete();
        });

    }, { async: true });


    desc("Test Server Code");
    task("test-server", ["node-version", TEMP_TEST_DIR], function () {
        console.log("\n\nStart testing server");

        var reporter = require("nodeunit").reporters.default;

        reporter.run(['test/server'], null, function (failures) {
                if (failures) fail('server tests fail!', failures);
                complete();
            }
        );

    }, { async: true });


    desc("Test Client Code");
    task("test-client", ["node-version", TEMP_TEST_DIR], function () {
        var message = 'client code tests failed';

        console.log("\n\nStart testing client\n");

        sh('node ./node_modules/karma/bin/karma run build/karma.conf.js', message, function (stdout) {
            if (stdout.indexOf(message) !== -1) fail('client tests fail!', message);

            console.log('Client tests passed');

            BROWSERS.forEach(function (browser) {
                assertBrowserTested(stdout, browser);
            });

            complete();
        });

    }, { async: true });


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
    task("node-version", [], function () {
        console.log("\nChecking node version\n");

        sh("node --version", '', function (version) {
            if (version.trim() !== NODE_VERSION) {
                fail("Not the right version: " + version +
                    "should be: " + NODE_VERSION);
            }
            complete();
        });

    }, {async: true});


    function sh(cmd, errMessage, callback) {
        console.log("> " + cmd);

        var process = jake.createExec([cmd], { printStderr: false });
        var stdout = "";

        process.on('error', function () {
            console.log(stdout);
            callback(errMessage);
        });

        process.on('stdout', function (buffer) {
            stdout += buffer;
        });

        process.on('cmdEnd', function () {
            callback(stdout);
        });

        process.run();
    }


    function assertBrowserTested (output, browser) {
        if (output.indexOf(browser) !== -1)  {
            return true;
        }
        else {
            console.log('Browser was not tested: ' + browser);
            return false;
        }
    }


    function getServerFiles() {
        var files = new jake.FileList();
        files.include("**/**/*.js");
        files.exclude("./src/client/**");
        files.exclude("./node_modules/**");
        files.exclude("./test/client/**");
        files.exclude("./vendor/**/**");

        return files.toArray();
    }


    function getClientFiles() {
        var files = new jake.FileList();
        files.include("./src/client/**/*.js");
        files.include("./test/client/**/*.js");

        return files.toArray();
    }


    function getLintOptions_Global() {
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
            trailing: true
        };
        return options;
    }


    function getLintOptions_Node() {
        var options = getLintOptions_Global();
        options.node = true;
        return options;
    }


    function getLintOptions_Browser() {
        var options = getLintOptions_Global();
        options.browser = true;
        options.expr = true;
        return options;
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
