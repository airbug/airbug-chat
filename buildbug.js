//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
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
var nodejs              = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version             = "0.0.5";
var dependencies        = {
    "aws-sdk": "1.17.1",
    bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
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
            "../bugjs/projects/bugcall/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
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
            "../bugpack/projects/bugpack-client/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ],
        serverStickyPaths: [
            "../bugjs/external/aceexts/js/src",
            "../bugjs/external/acekeybindings/js/src",
            "../bugjs/external/acemodes/js/src",
            "../bugjs/external/acesnippets/js/src",
            "../bugjs/external/acethemes/js/src",
            "../bugjs/external/acesnippets/js/src"
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
            "../bugjs/projects/aws/js/src",
            "../bugjs/projects/bugcall/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugentity/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
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
            "./projects/airbugserver/js/scripts"
        ],
        resourcePaths: [
            "./projects/airbugclient/resources",
            "./projects/airbugserver/resources"
        ]
    },
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
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "./projects/airbugserver/js/test",
            "../bugjs/projects/bugcall/js/test",
            "../bugjs/projects/bugdelta/js/test",
            "../bugjs/projects/bugentity/js/test",
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugioc/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugmeta/js/test",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/test",
            "../bugjs/projects/bugtrace/js/test",
            "../bugjs/projects/configbug/js/test",
            "../bugjs/projects/handshaker/js/test",
            "../bugjs/projects/mongo/js/test",
            "../bugjs/projects/socketio/bugjars/socket/js/test",
            "../meldbug/projects/meldbug/bugjars/core/js/test",
            "../meldbug/projects/meldbugserver/js/test"
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
                        buildProject.getProperty("unitTest.sourcePaths")
                    ),
                    scriptPaths: buildProject.getProperty("server.scriptPaths").concat(
                        buildProject.getProperty("unitTest.scriptPaths")
                    ),
                    testPaths: buildProject.getProperty("unitTest.testPaths"),
                    resourcePaths: buildProject.getProperty("server.resourcePaths"),
                    staticPaths: ["{{static.outputPath}}"]
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

            //Create test package (this is not the production package). We create a different package for testing so that the production code does not have the unit test code in it.

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("unitTest.packageJson"),
                        sourcePaths: buildProject.getProperty("server.sourcePaths").concat(
                            buildProject.getProperty("unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("server.scriptPaths").concat(
                            buildProject.getProperty("unitTest.scriptPaths")
                        ),
                        staticPaths: buildProject.getProperty("static.serverStickyPaths"),
                        testPaths: buildProject.getProperty("unitTest.testPaths"),
                        resourcePaths: buildProject.getProperty("server.resourcePaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("unitTest.packageJson.name"),
                            buildProject.getProperty("unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{unitTest.packageJson.name}}",
                        packageVersion: "{{unitTest.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("unitTest.packageJson.name"),
                            buildProject.getProperty("unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                })
            ]),

            // Create production package

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


// Marketing Flow
//-------------------------------------------------------------------------------

buildTarget('marketing').buildFlow(
    series([
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailFacebookIcon"),
                options: {
                    acl: 'public-read'
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailTwitterIcon"),
                options: {
                    acl: 'public-read'
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailLogoImage320x120"),
                options: {
                    acl: 'public-read'
                },
                bucket: "{{prod-static-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            properties: {
                file: buildProject.getProperty("marketingContent.emailLogoImage200x70"),
                options: {
                    acl: 'public-read'
                },
                bucket: "{{prod-static-bucket}}"
            }
        })
    ])
);
