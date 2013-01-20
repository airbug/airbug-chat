//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug = require('buildbug');
var path = require('path');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject = buildbug.buildProject;
var buildProperties = buildbug.buildProperties;
var buildTarget = buildbug.buildTarget;
var enableModule = buildbug.enableModule;
var parallel = buildbug.parallel;
var series = buildbug.series;
var targetTask = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var bugpack = enableModule('bugpack');
//var bugunit = enableModule('bugunit');
var clientjs = enableModule('clientjs');
var core = enableModule('core');
var nodejs = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    server: {
        packageJson: {
            name: "airbugserver",
            version: "0.0.1",
            main: "./lib/AirBugServer.js",
            dependencies: {
                bugpack: "https://s3.amazonaws.com/node_modules/bugpack-0.0.3.tgz",
                express: "3.0.x"
            },
            scripts: {
                start: "node ./scripts/start.js"
            }
        },
        sourcePaths: [
            "./projects/airbugserver/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/annotate/js/src",
            "../bugunit/projects/bugunit-annotate/js/src"
        ],
        scriptPaths: [
            "./projects/airbugserver/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugjs/js/test"
        ]
    },
    client: {
        clientJson: {
            name: "airbugclient",
            version: "0.0.1"
        },
        sourcePaths: [
            "./projects/airbugclient/js/src"
        ]
    }
});


//-------------------------------------------------------------------------------
// Declare Tasks
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Flows
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
   targetTask('clean')
);

//TODO BRN: Local development of node js and client side projects should "create" the packages and package them up but
// the sources should be symlinked to instead

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperties().server.packageJson,
                        sourcePaths: buildProject.getProperties().server.sourcePaths,
                        scriptPaths: buildProject.getProperties().server.scriptPaths,
                        testPaths: buildProject.getProperties().server.testPaths
                    }
                }),
                /*targetTask('runNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperties().server.packageJson.name,
                            buildProject.getProperties().server.packageJson.version
                        );
                        task.updateProperties({
                            modulePath: nodePackage.getBuildPath()
                        });
                    }
                }),*/
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperties().server.packageJson.name,
                            buildProject.getProperties().server.packageJson.version
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperties().server.packageJson.name,
                        packageVersion: buildProject.getProperties().server.packageJson.version
                    }
                })
            ]),
            series([
                // TODO BRN: build client app
            ])
        ])
    ])
).makeDefault();
