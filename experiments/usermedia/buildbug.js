//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug = require('buildbug');


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

var aws = enableModule("aws");
var bugpack = enableModule('bugpack');
var bugunit = enableModule('bugunit');
var clientjs = enableModule('clientjs');
var core = enableModule('core');
var nodejs = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    server: {
        packageJson: {
            name: "usermedia",
            version: "0.0.1",
            dependencies: {
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                express: "3.2.x",
                binaryjs: "0.1.x"
            },
            scripts: {
                start: "node ./scripts/usermedia-application-start.js"
            }
        },
        sourcePaths: [
            "./js/src",
            '../../../bugjs/projects/annotate/js/src',
            '../../../bugjs/projects/bugflow/js/src',
            '../../../bugjs/projects/bugfs/js/src',
            '../../../bugjs/projects/bugioc/js/src',
            '../../../bugjs/projects/bugjs/js/src',
            '../../../bugjs/projects/bugtrace/js/src',
            '../../../bugjs/projects/express/js/src',
            '../../../bugunit/projects/bugunit/js/src'
        ],
        scriptPaths: [
            "./js/scripts",
            "../../../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../../../bugjs/projects/bugflow/js/test",
            "../../../bugjs/projects/bugjs/js/test",
            "../../../bugjs/projects/bugtrace/js/test"
        ],
        staticPaths: [
            "./static"
        ]
    }
});


//-------------------------------------------------------------------------------
// Declare Tasks
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Flows
//-------------------------------------------------------------------------------

// Clean Flow
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local Flow
//-------------------------------------------------------------------------------

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
                        packageJson: buildProject.getProperty("server.packageJson"),
                        sourcePaths: buildProject.getProperty("server.sourcePaths"),
                        scriptPaths: buildProject.getProperty("server.scriptPaths"),
                        testPaths: buildProject.getProperty("server.testPaths"),

                        //TODO BRN: This is temporary until we get client js packages working.

                        resourcePaths: buildProject.getProperty("server.resourcePaths"),
                        staticPaths: buildProject.getProperty("server.staticPaths")
                    }
                }),
                parallel([
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("server.packageJson.name"),
                                buildProject.getProperty("server.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath(),
                                ignore: ["static"]
                            });
                        }
                    })
                ]),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("server.packageJson.name"),
                        packageVersion: buildProject.getProperty("server.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3EnsureBucket", {
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])
        ])
    ])
).makeDefault();

