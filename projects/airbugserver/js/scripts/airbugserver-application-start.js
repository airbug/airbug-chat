/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require("bugpack").loadContext(module, function(error, bugpack) {
    if (!error) {
        bugpack.loadExports(["bugapp.Application", "airbugserver.AirbugServerApplication"], function(error) {
            if (!error) {

                //-------------------------------------------------------------------------------
                // Common Modules
                //-------------------------------------------------------------------------------

                var domain                      = require("domain");


                //-------------------------------------------------------------------------------
                // BugPack
                //-------------------------------------------------------------------------------

                var AirbugServerApplication     = bugpack.require("airbugserver.AirbugServerApplication");
                var Application                 = bugpack.require("bugapp.Application");


                //-------------------------------------------------------------------------------
                // Script
                //-------------------------------------------------------------------------------

                var applicationDomain = domain.create();
                applicationDomain.on("error", function(error) {

                    console.log(error.message);
                    console.log(error.stack);

                    // Note: we're in dangerous territory!
                    // By definition, something unexpected occurred,
                    // which we probably didn"t want.
                    // Anything can happen now!  Be very careful!

                    gracefulShutdown();
                });

                var application = new AirbugServerApplication();
                applicationDomain.add(application);
                applicationDomain.add(bugpack);
                applicationDomain.add(AirbugServerApplication);

                applicationDomain.run(function() {

                    console.log("Starting airbug server...");
                    application.addEventListener(Application.EventTypes.STARTED, function(event) {
                        console.log("Airbug server successfully started");
                    });
                    application.addEventListener(Application.EventTypes.STOPPED, function(event) {
                        process.exit();
                    });
                    application.addEventListener(Application.EventTypes.ERROR, function(event) {
                        var error = event.getData().error;
                        console.log(error.message);
                        console.log(error.stack);
                        if (application.isStarting()) {
                            process.exit(1);
                        } else if (application.isStarted()) {
                            gracefulShutdown();
                        } else if (application.isStopping()) {
                            //do nothing (try to finish up the stop)
                        } else {
                            process.exit(1);
                        }
                    });

                    application.start();
                });

                var gracefulShutdown = function() {
                    var killtimer = setTimeout(function() {
                        process.exit(1);
                    }, 10000);
                    killtimer.unref();

                    try {
                        application.stop();
                    } catch(error) {
                        process.exit(1);
                    }
                };

                process.on("SIGINT", gracefulShutdown);
                process.on("SIGTERM", gracefulShutdown);

            } else {
                console.log(error.message);
                console.log(error.stack);
                process.exit(1);
            }
        });
    } else {
        console.log(error.message);
        console.log(error.stack);
        process.exit(1);
    }
});
