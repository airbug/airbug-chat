//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildScript         = buildbug.buildScript;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws                 = enableModule("aws");
var bugpack             = enableModule('bugpack');
var bugunit             = enableModule('bugunit');
var clientjs            = enableModule('clientjs');
var core                = enableModule('core');
var lintbug             = enableModule("lintbug");
var nodejs              = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version             = "0.0.17";
var dependencies        = {
    "aws-sdk": "1.17.1",
    bugpack: "https://s3.amazonaws.com/deploy-airbug/bugpack-0.0.5.tgz",
    "buffer-crc32": "0.2.1",
    connect: "2.12.0",
    cookie: "0.1.0",
    "cookie-signature": "1.0.1",
    express: "3.4.8",
    imagemagick: "0.1.3",
    mu2express: "0.0.1",
    mongodb: "1.3.23",
    mongoose: "3.8.4",
    redis: "0.10.0",
    "socket.io": "0.9.16",
    bcrypt: "0.7.7",
    github: "0.1.12"
};


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    static: {
        outputPath: buildProject.getProperty("buildPath") + "/static",
        sourcePaths: [
            "./projects/airbug/js/src",
            "./projects/airbugclient/js/src",
            "./projects/airbugclient/static",
            "../bugcore/projects/bugcore/js/src",
            "../bugjs/external/ace/js/src",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap2/js/src",
            "../bugjs/external/bootstrap2/static",
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/jquery-plugins/js/src/fileupload",
            "../bugjs/external/jquery-plugins/js/src/selectText",
            "../bugjs/external/jquery-plugins/js/src/validator",
            "../bugjs/external/mustache/js/src",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/external/socialbuttons/static",
            "../bugjs/external/underscore/js/src",
            "../bugjs/external/zeroclipboard/js/src",
            "../bugjs/external/zeroclipboard/static",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/bugjars/client/js/src",
            "../bugjs/projects/bugcall/bugjars/core/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugmvc/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/carapace/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/session/js/src",
            "../bugjs/projects/socketio/bugjars/client/js/src",
            "../bugjs/projects/socketio/bugjars/factorybrowser/js/src",
            "../bugjs/projects/socketio/bugjars/socket/js/src",
            "../meldbug/projects/meldbug/bugjars/core/js/src",
            "../meldbug/projects/meldbugclient/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ],
        serverStickyPaths: [
            "../bugjs/external/aceexts/js/src",
            "../bugjs/external/acekeybindings/js/src",
            "../bugjs/external/acemodes/js/src",
            "../bugjs/external/acesnippets/js/src",
            "../bugjs/external/acethemes/js/src",
            "../bugjs/external/aceworkers/js/src"
        ]
    },
    server: {
        packageJson: {
            name: "airbugserver",
            version: version,
            main: "./lib/AirBugServer.js",
            dependencies: dependencies,
            scripts: {
                start: "node ./scripts/airbug-server-application-start.js"
            }
        },
        sourcePaths: [
            "./projects/airbug/js/src",
            "./projects/airbugserver/js/src",
            "./projects/airbugserver/js/migrations",
            "../bugjs/projects/aws/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/bugjars/core/js/src",
            "../bugjs/projects/bugcall/bugjars/publisher/js/src",
            "../bugjs/projects/bugcall/bugjars/server/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugentity/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugmigrate/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/express/js/src",
            "../bugjs/projects/handshaker/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/mongo/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/bugjars/server/js/src",
            "../bugjs/projects/socketio/bugjars/socket/js/src",
            "../meldbug/projects/meldbug/bugjars/core/js/src",
            "../meldbug/projects/meldbug/bugjars/server/js/src",
            "../meldbug/projects/meldbugserver/js/src"
        ],
        scriptPaths: [
            "./projects/airbugserver/js/scripts",
            "../bugjs/projects/bugmigrate/js/scripts"
        ],
        resourcePaths: [
            "./projects/airbugclient/resources",
            "./projects/airbugserver/resources"
        ],
        unitTest: {
            packageJson: {
                name: "airbugserver-test",
                version: version,
                main: "./lib/AirBugServer.js",
                dependencies: dependencies,
                scripts: {
                    start: "node ./scripts/airbug-server-application-start.js"
                }
            },
            sourcePaths: [
                "../bugjs/projects/bugyarn/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "./projects/airbug/js/test",
                "./projects/airbugserver/js/test",
                "../bugjs/projects/aws/js/test",
                "../bugjs/projects/bugapp/js/test",
                "../bugjs/projects/bugcall/bugjars/core/js/test",
                "../bugjs/projects/bugcall/bugjars/publisher/js/test",
                "../bugjs/projects/bugcall/bugjars/server/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugentity/js/test",
                "../bugjs/projects/bugflow/js/test",
                "../bugjs/projects/bugioc/js/test",
                "../bugjs/projects/bugjs/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugmeta/js/test",
                "../bugjs/projects/bugroute/bugjars/bugcall/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/bugtrace/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/express/js/test",
                "../bugjs/projects/handshaker/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/mongo/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/bugjars/server/js/test",
                "../bugjs/projects/socketio/bugjars/socket/js/test",
                "../meldbug/projects/meldbug/bugjars/core/js/test",
                "../meldbug/projects/meldbug/bugjars/server/js/test",
                "../meldbug/projects/meldbugserver/js/test"
            ]
        }
    },
    worker:  {
        packageJson: {
            name: "airbugworker",
                version: version,
                dependencies: dependencies,
                scripts: {
                start: "node ./scripts/airbug-worker-application-start.js"
            }
        },
        resourcePaths: [
            "./projects/airbugworker/resources"
        ],
        sourcePaths: [
            "./projects/airbugworker/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/bugjars/core/js/src",
            "../bugjs/projects/bugcall/bugjars/publisher/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/bugwork/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/bugjars/socket/js/src"
        ],
        scriptPaths: [
            "../bugjs/projects/bugwork/js/scripts",
            "./projects/airbugworker/js/scripts"
        ],
        unitTest: {
            packageJson: {
                name: "airbugworker-test",
                    version: version,
                    dependencies: dependencies,
                    scripts: {
                    start: "node ./scripts/airbug-worker-application-start.js"
                }
            },
            sourcePaths: [
                "../bugjs/projects/bugyarn/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "./projects/airbugworker/js/test",
                "../bugjs/projects/bugapp/js/test",
                "../bugjs/projects/bugcall/bugjars/core/js/test",
                "../bugjs/projects/bugcall/bugjars/publisher/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugflow/js/test",
                "../bugjs/projects/bugioc/js/test",
                "../bugjs/projects/bugjs/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugmeta/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/bugtrace/js/test",
                "../bugjs/projects/bugwork/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/bugjars/socket/js/test"
            ]
        }
    },
    lint: {
        targetPaths: [
            "."
        ],
        ignorePatterns: [
            ".*\\.buildbug$",
            ".*\\.bugunit$",
            ".*\\.git$",
            ".*node_modules$"
        ]
    },
    marketingContent: {
        emailFacebookIcon: "./projects/marketing/static/img/airbug_email_facebook-icon.jpg",
        emailTwitterIcon: "./projects/marketing/static/img/airbug_email_twitter-icon.jpg",
        emailLogoImage320x120: "./projects/marketing/static/img/airbug_email_text-logo_320x120.png",
        emailLogoImage200x70: "./projects/marketing/static/img/airbug_email_text-logo_200x70.png"
    }
});


//-------------------------------------------------------------------------------
// Declare BuildTargets
//-------------------------------------------------------------------------------

// Clean BuildTarget
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
   targetTask('clean')
);


// Local BuildTarget
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([
            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("static.sourcePaths").concat(
                            buildProject.getProperty("static.serverStickyPaths")
                        ),
                        intoPath: "{{static.outputPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        sourceRoot: "{{static.outputPath}}"
                    }
                }),
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        sourcePaths: buildProject.getProperty("server.sourcePaths").concat(
                            buildProject.getProperty("server.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("server.scriptPaths").concat(
                            buildProject.getProperty("server.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("server.unitTest.testPaths"),
                        resourcePaths: buildProject.getProperty("server.resourcePaths"),
                        staticPaths: ["{{static.outputPath}}"]
                    }
                }),
                targetTask('replaceTokens', {
                    properties: {
                        tokenObjects: [
                            {token: "{{BUILD_VERSION}}", replacementValue: version, filePaths: [buildProject.getProperty("buildPath") + "/airbugserver/" + version + "/resources/config"]}
                        ]
                    }
                }),
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
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{server.packageJson.name}}",
                        packageVersion: "{{server.packageJson.version}}"
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
                            //checkCoverage: true
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{local-bucket}}"
                    }
                })
            ]),
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.packageJson"),
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths").concat(
                            buildProject.getProperty("worker.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths").concat(
                            buildProject.getProperty("worker.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("worker.unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{local-bucket}}"
                    }
                })
            ]),
            targetTask('lint', {
                properties: {
                    targetPaths: buildProject.getProperty("bugjs.targetPaths"),
                    ignores: buildProject.getProperty("bugjs.ignorePatterns"),
                    lintTasks: [
                        "fixExportAndRemovePackageAnnotations"
                    ]
                }
            })
        ])
    ])
).makeDefault();


// Prod BuildTarget
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([

            //Create test airbugserver package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.unitTest.packageJson"),
                        sourcePaths: buildProject.getProperty("server.sourcePaths").concat(
                            buildProject.getProperty("server.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("server.scriptPaths").concat(
                            buildProject.getProperty("server.unitTest.scriptPaths")
                        ),
                        staticPaths: buildProject.getProperty("static.serverStickyPaths"),
                        testPaths: buildProject.getProperty("server.unitTest.testPaths"),
                        resourcePaths: buildProject.getProperty("server.resourcePaths")
                    }
                }),
                targetTask('replaceTokens', {
                    properties: {
                        tokenObjects: [
                            {token: "{{BUILD_VERSION}}", replacementValue: version, filePaths: [buildProject.getProperty("buildPath") + "/airbugserver/" + version + "/resources/config"]}
                        ]
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("server.unitTest.packageJson.name"),
                            buildProject.getProperty("server.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{server.unitTest.packageJson.name}}",
                        packageVersion: "{{server.unitTest.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("server.unitTest.packageJson.name"),
                            buildProject.getProperty("server.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath(),
                            checkCoverage: true
                        });
                    }
                })
            ]),

            // Create production airbugserver package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        sourcePaths: buildProject.getProperty("server.sourcePaths"),
                        scriptPaths: buildProject.getProperty("server.scriptPaths"),
                        staticPaths: buildProject.getProperty("static.serverStickyPaths"),
                        resourcePaths: buildProject.getProperty("server.resourcePaths")
                    }
                }),
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
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{server.packageJson.name}}",
                        packageVersion: "{{server.packageJson.version}}"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{prod-deploy-bucket}}"
                    }
                })
            ]),

            // Create test airbugworker package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.unitTest.packageJson"),
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths").concat(
                            buildProject.getProperty("worker.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths").concat(
                            buildProject.getProperty("worker.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("worker.unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.unitTest.packageJson.name"),
                            buildProject.getProperty("worker.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.unitTest.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.unitTest.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("worker.unitTest.packageJson.name"),
                            buildProject.getProperty("worker.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath(),
                            checkCoverage: true
                        });
                    }
                })
            ]),

            // Create production airbugworker package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.packageJson"),
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths"),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.packageJson.version")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{prod-deploy-bucket}}"
                    }
                })
            ]),
            // Create static contents folder and upload contents to S3

            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("static.sourcePaths"),
                        intoPath: "{{static.outputPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        sourceRoot: "{{static.outputPath}}"
                    }
                }),
                targetTask("s3PutDirectoryContents", {
                    properties: {
                        directory: "{{static.outputPath}}",
                        options: {
                            acl: 'public-read',
                            gzip: true,
                            base: "airbug/" + version + "/static",
                            cacheControl: "max-age=31536000, public"
                        },
                        bucket: "{{prod-static-bucket}}"
                    }
                })
            ])
        ])
    ])
);


// Marketing BuildTarget
//-------------------------------------------------------------------------------

buildTarget('marketing').buildFlow(
    series([
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailFacebookIcon"),
                options: {
                    acl: 'public-read',
                    gzip: true,
                    cacheControl: "max-age=31536000, public"
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailTwitterIcon"),
                options: {
                    acl: 'public-read',
                    gzip: true,
                    cacheControl: "max-age=31536000, public"
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailLogoImage320x120"),
                options: {
                    acl: 'public-read',
                    gzip: true,
                    cacheControl: "max-age=31536000, public"
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailLogoImage200x70"),
                options: {
                    acl: 'public-read',
                    gzip: true,
                    cacheControl: "max-age=31536000, public"
                },
                bucket: "{{prod-static-bucket}}"
            }
        })
    ])
);


//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow"
    ],
    script: "../bugjs/lintbug.js"
});
