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
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                express: "3.0.x",
                mu2express: "0.0.x",
                "mongodb": ">=1.2.11",
                "mongoose": ">=3.5.6"
            },
            scripts: {
                start: "node ./scripts/start.js"
            }
        },
        sourcePaths: [
            "./projects/airbugserver/js/src",
            '../bugjs/projects/annotate/js/src',
            '../bugjs/projects/bugboil/js/src',
            '../bugjs/projects/bugflow/js/src',
            '../bugjs/projects/bugfs/js/src',
            '../bugjs/projects/bugjs/js/src',
            '../bugjs/projects/bugtrace/js/src',
            '../bugunit/projects/bugunit/js/src'
           // "../bugjs/projects/clientjs/js/src"
        ],
        scriptPaths: [
            "./projects/airbugserver/js/scripts",
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugjs/js/test"
        ],

        //TODO BRN: These static paths are temporary until we get the client js server working.

        resourcePaths: [
            "./projects/airbugclient/resources"
        ],
        staticPaths: [
            "./projects/airbugclient/js/src",
            "./projects/airbugclient/static",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap/js/src",
            "../bugjs/external/bootstrap/static",
            "../bugjs/external/jquery/js/src",
            "../bugjs/projects/annotate/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/carapace/js/src",
            '../bugpack/projects/bugpack-client/js/src'
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
            "../bugjs/external/bootstrap/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/projects/annotate/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/carapace/js/src"

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
    },
    splash: {
        packageJson: {
            "name": "splash",
            "version": "0.0.4",
            "private": true,
            "scripts": {
                "start": "node ./lib/app"
            },
            "dependencies": {
                "bugpack": 'https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz',
                "express": "3.1.x",
                "jade": "*",
                "mongodb": ">=1.2.11",
                "mongoose": ">=3.5.6"
            }
        },
        resourcePaths: [
            './projects/splash/resources'
        ],
        scriptPaths: [
            "../bugunit/projects/bugunit/js/scripts"
        ],
        sourcePaths: [
            '../bugjs/projects/annotate/js/src',
            '../bugjs/projects/bugjs/js/src',
            '../bugjs/projects/bugboil/js/src',
            '../bugjs/projects/bugflow/js/src',
            '../bugjs/projects/bugfs/js/src',
            '../bugjs/projects/bugtrace/js/src',
            '../bugunit/projects/bugunit/js/src',
            './projects/splash/js/src'
        ],
        staticPaths: [
            '../bugjs/projects/bugjs/js/src',
            '../bugpack/projects/bugpack-client/js/src',
            '../sonarbug/projects/splitbug/js/src',
            '../sonarbug/projects/splitbugclient/js/src',
            './projects/splash/static'
        ],
        testPaths: [
            "../bugjs/projects/bugjs/js/test"
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
                                acl: 'public-read'
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
            ,
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("splash.packageJson"),
                        scriptPaths: buildProject.getProperty("splash.scriptPaths"),
                        sourcePaths: buildProject.getProperty("splash.sourcePaths"),
                        staticPaths: buildProject.getProperty("splash.staticPaths"),
                        resourcePaths: buildProject.getProperty("splash.resourcePaths")
                    }
                }),
                parallel([
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("splash.packageJson.name"),
                                buildProject.getProperty("splash.packageJson.version")
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
                                buildProject.getProperty("splash.packageJson.name"),
                                buildProject.getProperty("splash.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
                            });
                        }
                    })
                ]),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("splash.packageJson.name"),
                        packageVersion: buildProject.getProperty("splash.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
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
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version"));
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
                                acl: 'public-read'
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
                               acl: 'public-read'
                           }
                       });
                   },
                   properties: {
                       bucket: "airbug"
                   }
               })
            ])
            ,
            series([
            
                // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
                // old source files are removed. We should figure out a better way of doing that.
            
                targetTask('clean'),
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("splash.packageJson"),
                        scriptPaths: buildProject.getProperty("splash.scriptPaths"),
                        sourcePaths: buildProject.getProperty("splash.sourcePaths"),
                        staticPaths: buildProject.getProperty("splash.staticPaths"),
                        resourcePaths: buildProject.getProperty("splash.resourcePaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("splash.packageJson.name"),
                        packageVersion: buildProject.getProperty("splash.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
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
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read'
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
