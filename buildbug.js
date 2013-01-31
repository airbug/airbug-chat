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
            name: "airbugserver",
            version: "0.0.1",
            main: "./lib/AirBugServer.js",
            dependencies: {
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.3.tgz",
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
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "./projects/airbugserver/js/scripts",
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugjs/js/test"
        ]
    },
    client: {
        clientJson: {
            name: "airbugclient",
            version: "0.0.1",
			template: "static/template.stache"
        },
        sourcePaths: [
            "./projects/airbugclient/js/src"
        ],
		staticPaths: [
			"./projects/airbugclient/static"
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
                        testPaths: buildProject.getProperty("server.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
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
                                ACL: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ]),
            series([
                // TODO BRN: build client app
				 targetTask('createClientPackage', {
	                   properties: {
                        clientJson: buildProject.getProperty("client.clientJson"),
                        sourcePaths: buildProject.getProperty("client.sourcePaths"),
                        staticPaths: buildProject.getProperty("client.staticPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var clientPackage = clientjs.findClientPackage(
                            buildProject.getProperty("client.clientJson.name"),
                            buildProject.getProperty("client.clientJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: clientPackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packClientPackage', {
                    properties: {
                        packageName: buildProject.getProperty("client.clientJson.name"),
                        packageVersion: buildProject.getProperty("client.clientJson.version")
                    }
                }),
                targetTask("s3EnsureBucket", {
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedClientPackage = clientjs.findPackedClientPackage(buildProject.getProperty("client.clientJson.name"),
                            buildProject.getProperty("client.clientJson.version"));
                        task.updateProperties({
                            file: packedClientPackage.getFilePath(),
                            options: {
                                ACL: 'public-read'
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


// Prod Flow
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
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
                        testPaths: buildProject.getProperty("server.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
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
                        bucket: "airbug"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                ACL: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: "airbug"
                    }
                })
            ]),
            series([
                // TODO BRN: build client app
				 targetTask('createClientPackage', {
	                  properties: {
                       clientJson: buildProject.getProperty("client.clientJson"),
                       sourcePaths: buildProject.getProperty("client.sourcePaths"),
                       staticPaths: buildProject.getProperty("client.staticPaths")
                   }
               }),
               targetTask('generateBugPackRegistry', {
                   init: function(task, buildProject, properties) {
                       var clientPackage = clientjs.findClientPackage(
                           buildProject.getProperty("client.clientJson.name"),
                           buildProject.getProperty("client.clientJson.version")
                       );
                       task.updateProperties({
                           sourceRoot: clientPackage.getBuildPath()
                       });
                   }
               }),
               targetTask('packClientPackage', {
                   properties: {
                       packageName: buildProject.getProperty("client.clientJson.name"),
                       packageVersion: buildProject.getProperty("client.clientJson.version")
                   }
               }),
               targetTask("s3EnsureBucket", {
                   properties: {
                       bucket: "airbug"
                   }
               }),
               targetTask("s3PutFile", {
                   init: function(task, buildProject, properties) {
                       var packedClientPackage = clientjs.findPackedClientPackage(buildProject.getProperty("client.clientJson.name"),
                           buildProject.getProperty("client.clientJson.version"));
                       task.updateProperties({
                           file: packedClientPackage.getFilePath(),
                           options: {
                               ACL: 'public-read'
                           }
                       });
                   },
                   properties: {
                       bucket: "airbug"
                   }
               })
            ])
        ])
    ])
);
