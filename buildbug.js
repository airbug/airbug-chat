//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject    = buildbug.buildProject;
var buildProperties = buildbug.buildProperties;
var buildTarget     = buildbug.buildTarget;
var enableModule    = buildbug.enableModule;
var parallel        = buildbug.parallel;
var series          = buildbug.series;
var targetTask      = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws         = enableModule("aws");
var bugpack     = enableModule('bugpack');
var bugunit     = enableModule('bugunit');
var clientjs    = enableModule('clientjs');
var core        = enableModule('core');
var nodejs      = enableModule('nodejs');


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
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                "buffer-crc32": "0.2.x",
                connect: "2.x",
                cookie: "0.1.x",
                "cookie-signature": "1.0.x",
                express: "3.2.x",
                mu2express: "0.0.x",
                mongodb: "1.3.x",
                mongoose: "3.8.2",
                redis: "0.9.x",
                "socket.io": "0.9.x",
                bcrypt: "0.7.x",
                github: "0.1.x"
            },
            scripts: {
                start: "node ./scripts/airbug-server-application-start.js"
            }
        },
        sourcePaths: [
            "./projects/airbug/js/src",
            "./projects/airbugserver/js/src",
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
            "../meldbug/projects/meldbug/js/src",
            "../meldbug/projects/meldbugserver/js/src"
        ],
        scriptPaths: [
            "./projects/airbugserver/js/scripts"
        ],

        //TODO BRN: These static paths are temporary until we get the client js server working.

        resourcePaths: [
            "./projects/airbugclient/resources",
            "./projects/airbugserver/resources"
        ],
        staticPaths: [
            "./projects/airbug/js/src",
            "./projects/airbugclient/js/src",
            "./projects/airbugclient/static",
            "../bugjs/external/ace/js/src",
            "../bugjs/external/aceexts/js/src",
            "../bugjs/external/acemodes/js/src",
            "../bugjs/external/acethemes/js/src",
            "../bugjs/external/acesnippets/js/src",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap2/js/src",
            "../bugjs/external/bootstrap2/static",
            "../bugjs/external/jquery/js/src",
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
            "../meldbug/projects/meldbug/js/src",
            "../meldbug/projects/meldbugclient/js/src",
            "../bugpack/projects/bugpack-client/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ]
    },
    unitTest: {
        packageJson: {
            name: "airbugserver-test",
            version: "0.0.1",
            main: "./lib/AirBugServer.js",
            dependencies: {
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                "buffer-crc32": "0.2.x",
                connect: "2.x",
                cookie: "0.1.x",
                "cookie-signature": "1.0.x",
                express: "3.2.x",
                mu2express: "0.0.x",
                mongodb: "1.3.x",
                mongoose: "3.8.2",
                redis: "0.9.x",
                "socket.io": "0.9.x",
                bcrypt: "0.7.x",
                github: "0.1.x"
            },
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
            "../meldbug/projects/meldbug/js/test",
            "../meldbug/projects/meldbugserver/js/test"
        ]
    },
    client: {
        clientJson: {
            name: "airbugclient",
            version: "0.0.1",
            template: "static/template.mustache"
            /*templates: [
                {
                    template: "static/template.mustache",
                    urlPattern: "/"
                }
            ]*/
        },
        sourcePaths: [
            "./projects/airbugclient/js/src",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap2/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/carapace/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ],
        staticPaths: [
            "./projects/airbugclient/static"
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
        parallel([
            series([
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
                    }),
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("server.packageJson.name"),
                                buildProject.getProperty("server.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
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

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])/*
            ,
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
                                acl: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])*/
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
                        testPaths: buildProject.getProperty("unitTest.testPaths"),

                        //TODO BRN: This is temporary until we get client js packages working.

                        resourcePaths: buildProject.getProperty("server.resourcePaths"),
                        staticPaths: buildProject.getProperty("server.staticPaths")
                    }
                }),
                parallel([
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
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("unitTest.packageJson.name"),
                                buildProject.getProperty("unitTest.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
                            });
                        }
                    })
                ]),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("unitTest.packageJson.name"),
                        packageVersion: buildProject.getProperty("unitTest.packageJson.version")
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
                    }),
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("server.packageJson.name"),
                                buildProject.getProperty("server.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
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

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "airbug"
                    }
                })
            ])
            /*series([
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
                               acl: 'public-read'
                           }
                       });
                   },
                   properties: {
                       bucket: "airbug"
                   }
               })
            ])*/
        ])
    ])
);


// Marketing Flow
//-------------------------------------------------------------------------------

buildTarget('marketing').buildFlow(
    series([
        targetTask("s3EnsureBucket", {
            properties: {
                bucket: "airbug"
            }
        }),
        parallel([
            targetTask("s3PutFile", {
                properties: {
                    file: buildProject.getProperty("marketingContent.emailFacebookIcon"),
                    options: {
                        acl: 'public-read'
                    },
                    bucket: "airbug"
                }
            }),
            targetTask("s3PutFile", {
                properties: {
                    file: buildProject.getProperty("marketingContent.emailTwitterIcon"),
                    options: {
                        acl: 'public-read'
                    },
                    bucket: "airbug"
                }
            }),
            targetTask("s3PutFile", {
                properties: {
                    file: buildProject.getProperty("marketingContent.emailLogoImage320x120"),
                    options: {
                        acl: 'public-read'
                    },
                    bucket: "airbug"
                }
            }),
            targetTask("s3PutFile", {
                properties: {
                    file: buildProject.getProperty("marketingContent.emailLogoImage200x70"),
                    options: {
                        acl: 'public-read'
                    },
                    bucket: "airbug"
                }
            })
        ])
    ])
);
