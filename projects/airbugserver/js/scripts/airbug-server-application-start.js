//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('airbugserver.AirbugServerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AirbugServerApplication = bugpack.require('airbugserver.AirbugServerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var airbugServerApplication = new AirbugServerApplication();
airbugServerApplication.start(function(throwable) {
    console.log("Starting airbug server...");
    if (!throwable) {
        console.log("Airbug server successfully started");
    } else {
        console.error(throwable.message);
        console.error(throwable.stack);
        process.exit(1);
    }
});

var gracefulShutdown = function() {
    airbugServerApplication.stop(function(throwable) {
        if (throwable) {
            console.error(throwable.message);
            console.error(throwable.stack);
            process.exit(1);
        } else {
            process.exit();
        }
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
