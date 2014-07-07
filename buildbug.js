/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


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
var core                = enableModule('core');
var lintbug             = enableModule("lintbug");
var nodejs              = enableModule('nodejs');
var uglifyjs            = enableModule("uglifyjs");


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var name                = "airbug";
var version             = "0.0.20";
var dependencies        = {
    "aws-sdk": "1.17.1",
    bugpack: "0.1.12",
    "buffer-crc32": "0.2.1",
    connect: "2.12.0",
    cookie: "0.1.0",
    "cookie-signature": "1.0.1",
    express: "3.4.8",
    imagemagick: "0.1.3",
    mu2express: "0.0.1",
    mongodb: "1.3.23",
    mongoose: "3.8.9",
    redis: "0.10.0",
    "socket.io": "0.9.16",
    bcrypt: "0.7.7",
    github: "0.1.12"
};


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    name: name,
    version: version
});

buildProperties({
    bridge: {
        source: "./projects/airbugplugin/js/scripts/airbug-api-bridge.js",
        outputFile: "{{distPath}}/airbug-api-bridge.js",
        outputMinFile: "{{distPath}}/airbug-api-bridge.min.js"
    },
    client: {
        buildPath: "{{buildPath}}/{{client.name}}/{{client.version}}",
        jsBuildPath: "{{client.buildPath}}/js",
        staticBuildPath: "{{client.buildPath}}/static",
        name: "airbugclient",
        version: "{{version}}",
        outputFile: "{{distPath}}/{{client.name}}.js",
        outputMinFile: "{{distPath}}/{{client.name}}.min.js",
        sourcePaths: [
            "./libraries/airbug/js/src",
            "./libraries/api/js/src",
            "./libraries/common-web/js/src",
            "./libraries/ui/js/src",
            "./projects/airbugclient/js/src",
            "../bugcore/projects/bugcore/js/src",
            "../bugflow/projects/bugflow/js/src",
            "../bugjs/external/ace/js/src",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap2/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/jquery-plugins/js/src/fileupload",
            "../bugjs/external/jquery-plugins/js/src/selectText",
            "../bugjs/external/jquery-plugins/js/src/validator",
            "../bugjs/external/mustache/js/src",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/external/underscore/js/src",
            "../bugjs/external/zeroclipboard/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/libraries/client/js/src",
            "../bugjs/projects/bugcall/libraries/core/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugdispose/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmvc/js/src",
            "../bugjs/projects/bugrequest/libraries/context/js/src",
            "../bugjs/projects/bugrequest/libraries/core/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/carapace/libraries/core/js/src",
            "../bugjs/projects/carapace/libraries/ui/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/session/js/src",
            "../bugjs/projects/socketio/libraries/client/js/src",
            "../bugjs/projects/socketio/libraries/factorybrowser/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "../meldbug/projects/meldbug/bugjars/core/js/src",
            "../meldbug/projects/meldbugclient/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ],
        staticPaths: [
            "./projects/airbugclient/static",
            "../bugjs/external/bootstrap2/static",
            "../bugjs/external/socialbuttons/static",
            "../bugjs/external/zeroclipboard/static",
        ],
        serverStickyPaths: [
            "../bugjs/external/aceexts/js/src",
            "../bugjs/external/acekeybindings/js/src",
            "../bugjs/external/acemodes/js/src",
            "../bugjs/external/acesnippets/js/src",
            "../bugjs/external/acethemes/js/src",
            "../bugjs/external/aceworkers/js/src"
        ],
        loader: {
            source: "./projects/airbugclient/js/scripts/airbugclient-application-loader.js",
            outputFile: "{{distPath}}/airbugclient-application-loader.js",
            outputMinFile: "{{distPath}}/airbugclient-application-loader.min.js"
        }
    },
    plugin: {
        buildPath: "{{buildPath}}/{{plugin.name}}/{{plugin.version}}",
        jsBuildPath: "{{plugin.buildPath}}/js",
        staticBuildPath: "{{plugin.buildPath}}/static",
        name: "airbugplugin",
        version: "{{version}}",
        outputFile: "{{distPath}}/{{plugin.name}}.js",
        outputMinFile: "{{distPath}}/{{plugin.name}}.min.js",
        sourcePaths: [
            "./libraries/airbug/js/src",
            "./libraries/api/js/src",
            "./libraries/common-web/js/src",
            "./libraries/ui/js/src",
            "./projects/airbugplugin/js/src",
            "../bugcore/projects/bugcore/js/src",
            "../bugflow/projects/bugflow/js/src",
            "../bugjs/external/backbone/js/src",
            "../bugjs/external/bootstrap2/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/jquery-plugins/js/src/fileupload",
            "../bugjs/external/jquery-plugins/js/src/selectText",
            "../bugjs/external/jquery-plugins/js/src/validator",
            "../bugjs/external/mustache/js/src",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/external/underscore/js/src",
            "../bugjs/external/zeroclipboard/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/libraries/client/js/src",
            "../bugjs/projects/bugcall/libraries/core/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugdispose/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmvc/js/src",
            "../bugjs/projects/bugrequest/libraries/context/js/src",
            "../bugjs/projects/bugrequest/libraries/core/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/carapace/libraries/core/js/src",
            "../bugjs/projects/carapace/libraries/ui/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/session/js/src",
            "../bugjs/projects/socketio/libraries/client/js/src",
            "../bugjs/projects/socketio/libraries/factorybrowser/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "../meldbug/projects/meldbug/bugjars/core/js/src",
            "../meldbug/projects/meldbugclient/js/src",
            "../sonarbug/projects/sonarbugclient/js/src"
        ],
        staticPaths: [
            "./projects/airbugplugin/static",
            "../bugjs/external/bootstrap2/static",
            "../bugjs/external/socialbuttons/static",
            "../bugjs/external/zeroclipboard/static",
        ],
        loader: {
            source: "./projects/airbugplugin/js/scripts/airbugplugin-application-loader.js",
            outputFile: "{{distPath}}/airbugplugin-application-loader.js",
            outputMinFile: "{{distPath}}/airbugplugin-application-loader.min.js"
        }
    },
    server: {
        packageJson: {
            name: "airbugserver",
            version: version,
            dependencies: dependencies,
            scripts: {
                start: "node ./scripts/airbugserver-application-start.js"
            }
        },
        sourcePaths: [
            "./libraries/airbug/js/src",
            "./projects/airbugserver/js/src",
            "./projects/airbugserver/js/migrations",
            "../bugflow/projects/bugflow/js/src",
            "../bugcore/projects/bugcore/js/src",
            "../bugfs/projects/bugfs/js/src",
            "../bugjs/projects/aws/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/libraries/core/js/src",
            "../bugjs/projects/bugcall/libraries/publisher/js/src",
            "../bugjs/projects/bugcall/libraries/server/js/src",
            "../bugjs/projects/bugcontroller/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugentity/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmigrate/js/src",
            "../bugjs/projects/bugrequest/libraries/context/js/src",
            "../bugjs/projects/bugrequest/libraries/core/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/express/js/src",
            "../bugjs/projects/handshaker/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/mongo/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/libraries/server/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
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
            "./projects/airbugplugin/resources",
            "./projects/airbugserver/resources"
        ],
        unitTest: {
            packageJson: {
                name: "airbugserver-test",
                version: version,
                dependencies: dependencies,
                scripts: {
                    start: "node ./scripts/airbugserver-application-start.js"
                }
            },
            sourcePaths: [
                "../buganno/projects/buganno/js/src",
                "../bugjs/projects/bugyarn/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../buganno/projects/buganno/js/scripts",
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "./libraries/airbug/js/test",
                "./projects/airbugserver/js/test",
                "../bugcore/projects/bugcore/js/test",
                "../bugflow/projects/bugflow/js/test",
                "../bugjs/projects/aws/js/test",
                "../bugjs/projects/bugapp/js/test",
                "../bugjs/projects/bugcall/libraries/core/js/test",
                "../bugjs/projects/bugcall/libraries/publisher/js/test",
                "../bugjs/projects/bugcall/libraries/server/js/test",
                "../bugjs/projects/bugcontroller/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugentity/js/test",
                "../bugjs/projects/bugioc/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugrequest/libraries/context/js/test",
                "../bugjs/projects/bugrequest/libraries/core/js/test",
                "../bugjs/projects/bugroute/bugjars/bugcall/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/express/js/test",
                "../bugjs/projects/handshaker/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/mongo/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/libraries/server/js/test",
                "../bugjs/projects/socketio/libraries/socket/js/test",
                "../bugmeta/projects/bugmeta/js/test",
                "../bugtrace/projects/bugtrace/js/test",
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
                start: "node ./scripts/airbugworker-application-start.js"
            }
        },
        resourcePaths: [
            "./projects/airbugworker/resources"
        ],
        sourcePaths: [
            "./projects/airbugworker/js/src",
            "../bugcore/projects/bugcore/js/src",
            "../bugflow/projects/bugflow/js/src",
            "../bugfs/projects/bugfs/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/libraries/core/js/src",
            "../bugjs/projects/bugcall/libraries/publisher/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/bugwork/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
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
                    start: "node ./scripts/airbugworker-application-start.js"
                }
            },
            sourcePaths: [
                "../buganno/projects/buganno/js/src",
                "../bugjs/projects/bugyarn/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../buganno/projects/buganno/js/scripts",
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "./projects/airbugworker/js/test",
                "../bugcore/projects/bugcore/js/test",
                "../bugflow/projects/bugflow/js/test",
                "../bugjs/projects/bugapp/js/test",
                "../bugjs/projects/bugcall/libraries/core/js/test",
                "../bugjs/projects/bugcall/libraries/publisher/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugioc/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/bugwork/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/libraries/socket/js/test",
                "../bugmeta/projects/bugmeta/js/test",
                "../bugtrace/projects/bugtrace/js/test"
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
        /*targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
   
                ]
            }
        }),*/
        parallel([
            series([
                parallel([
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{bridge.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{bridge.outputFile}}"],
                                outputFile: "{{bridge.outputMinFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{client.loader.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{client.loader.outputFile}}"],
                                outputFile: "{{client.loader.outputMinFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.staticPaths"),
                                intoPath: "{{client.staticBuildPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.sourcePaths"),
                                intoPath: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask('generateBugPackRegistry', {
                            properties: {
                                name: "{{client.name}}",
                                sourceRoot: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask("concat", {
                            init: function(task, buildProject, properties) {
                                var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("client.name"));
                                var sources         = [];
                                var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                                registryEntries.forEach(function(bugPackRegistryEntry) {
                                    sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                                });
                                task.updateProperties({
                                    sources: sources
                                });
                            },
                            properties: {
                                outputFile: "{{client.outputFile}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{client.outputFile}}"],
                                outputFile: "{{client.outputMinFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{plugin.loader.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{plugin.loader.outputFile}}"],
                                outputFile: "{{plugin.loader.outputMinFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("plugin.staticPaths"),
                                intoPath: "{{plugin.staticBuildPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("plugin.sourcePaths"),
                                intoPath: "{{plugin.jsBuildPath}}"
                            }
                        }),
                        targetTask('generateBugPackRegistry', {
                            properties: {
                                name: "{{plugin.name}}",
                                sourceRoot: "{{plugin.jsBuildPath}}"
                            }
                        }),
                        targetTask("concat", {
                            init: function(task, buildProject, properties) {
                                var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("plugin.name"));
                                var sources         = [];
                                var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                                registryEntries.forEach(function(bugPackRegistryEntry) {
                                    sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                                });
                                task.updateProperties({
                                    sources: sources
                                });
                            },
                            properties: {
                                outputFile: "{{plugin.outputFile}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{plugin.outputFile}}"],
                                outputFile: "{{plugin.outputMinFile}}"
                            }
                        })
                    ])
                ]),
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("server.sourcePaths").concat(
                                buildProject.getProperty("server.unitTest.sourcePaths")
                            ),
                            "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                                buildProject.getProperty("server.unitTest.scriptPaths")
                            ),
                            "./test": buildProject.getProperty("server.unitTest.testPaths"),
                            "./resources": buildProject.getProperty("server.resourcePaths"),
                            "./static": buildProject.getProperty("client.serverStickyPaths").concat([
                                "{{client.staticBuildPath}}",
                                "{{plugin.staticBuildPath}}"
                            ]),
                            "./static/js/client": [
                                "{{client.jsBuildPath}}",
                                buildProject.getProperty("client.outputFile"),
                                buildProject.getProperty("client.outputMinFile"),
                                buildProject.getProperty("client.loader.outputFile"),
                                buildProject.getProperty("client.loader.outputMinFile")
                            ],
                            "./static/js/plugin": [
                                "{{plugin.jsBuildPath}}",
                                buildProject.getProperty("plugin.outputFile"),
                                buildProject.getProperty("plugin.outputMinFile"),
                                buildProject.getProperty("plugin.loader.outputFile"),
                                buildProject.getProperty("plugin.loader.outputMinFile")
                            ],
                            "./static/js/bridge": [
                                buildProject.getProperty("bridge.outputFile"),
                                buildProject.getProperty("bridge.outputMinFile")
                            ]
                        }
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
            ])/*,
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
            ])*/
        ])
    ])
).makeDefault();


// Short BuildTarget
//-------------------------------------------------------------------------------

buildTarget('short').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([

            series([
                parallel([
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{bridge.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{client.loader.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.staticPaths"),
                                intoPath: "{{client.staticBuildPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.sourcePaths"),
                                intoPath: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask('generateBugPackRegistry', {
                            properties: {
                                name: "{{client.name}}",
                                sourceRoot: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask("concat", {
                            init: function(task, buildProject, properties) {
                                var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("client.name"));
                                var sources         = [];
                                var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                                registryEntries.forEach(function(bugPackRegistryEntry) {
                                    sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                                });
                                task.updateProperties({
                                    sources: sources
                                });
                            },
                            properties: {
                                outputFile: "{{client.outputFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copy', {
                            properties: {
                                fromPaths: ["{{plugin.loader.source}}"],
                                intoPath: "{{distPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("plugin.staticPaths"),
                                intoPath: "{{plugin.staticBuildPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("plugin.sourcePaths"),
                                intoPath: "{{plugin.jsBuildPath}}"
                            }
                        }),
                        targetTask('generateBugPackRegistry', {
                            properties: {
                                name: "{{plugin.name}}",
                                sourceRoot: "{{plugin.jsBuildPath}}"
                            }
                        }),
                        targetTask("concat", {
                            init: function(task, buildProject, properties) {
                                var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("plugin.name"));
                                var sources         = [];
                                var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                                registryEntries.forEach(function(bugPackRegistryEntry) {
                                    sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                                });
                                task.updateProperties({
                                    sources: sources
                                });
                            },
                            properties: {
                                outputFile: "{{plugin.outputFile}}"
                            }
                        })
                    ])
                ]),
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("server.sourcePaths").concat(
                                buildProject.getProperty("server.unitTest.sourcePaths")
                            ),
                            "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                                buildProject.getProperty("server.unitTest.scriptPaths")
                            ),
                            "./test": buildProject.getProperty("server.unitTest.testPaths"),
                            "./resources": buildProject.getProperty("server.resourcePaths"),
                            "./static": buildProject.getProperty("client.serverStickyPaths").concat([
                                "{{client.staticBuildPath}}",
                                "{{plugin.staticBuildPath}}"
                            ]),
                            "./static/js/client": [
                                "{{client.jsBuildPath}}",
                                buildProject.getProperty("client.outputFile"),
                                buildProject.getProperty("client.loader.outputFile")
                            ],
                            "./static/js/plugin": [
                                "{{plugin.jsBuildPath}}",
                                buildProject.getProperty("plugin.outputFile"),
                                buildProject.getProperty("plugin.loader.outputFile")
                            ],
                            "./static/js/bridge": [
                                buildProject.getProperty("bridge.outputFile")
                            ]
                        }
                    }
                }),
                targetTask('replaceTokens', {
                    properties: {
                        tokenObjects: [
                            {
                                token: "{{BUILD_VERSION}}",
                                replacementValue: version,
                                filePaths: [buildProject.getProperty("buildPath") + "/airbugserver/" + version + "/resources/config"]
                            }
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
                })
            ])
        ])
    ])
);


// Prod BuildTarget
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [

                ]
            }
        }),
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
                        staticPaths: buildProject.getProperty("client.serverStickyPaths"),
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
                        staticPaths: buildProject.getProperty("client.serverStickyPaths"),
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
                        fromPaths: buildProject.getProperty("client.sourcePaths"),
                        intoPath: "{{client.buildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        sourceRoot: "{{client.buildPath}}"
                    }
                }),
                targetTask("s3PutDirectoryContents", {
                    properties: {
                        directory: "{{client.buildPath}}",
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

//buildScript({
//    dependencies: [
//        "bugcore",
//        "bugflow"
//    ],
//    script: "../bugjs/lintbug.js"
//});
