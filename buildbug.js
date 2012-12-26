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
            "dependencies": {
                "bugpack": "git+ssh://git@github.com:bneisler/bugpack.git#master"
            }
        },
        sourcePaths: [
            "./projects/airbugserver/js/src",
            "../bugjs/projects/bugjs/js/src"
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
                        sourcePaths: buildProject.getProperties().server.sourcePaths
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(buildProject.getProperties().server.packageJson.name);
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperties().server.packageJson.name
                    }
                })
            ]),
            series([
                // TODO BRN: build client app
            ])
        ])
    ])
).makeDefault();
