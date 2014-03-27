//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('bugapp.Application')
//@Require('airbugserver.AirbugServerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context(module);
var domain                      = require('domain');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Application                 = bugpack.require('bugapp.Application');
var AirbugServerApplication     = bugpack.require('airbugserver.AirbugServerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var applicationDomain = domain.create();
applicationDomain.on('error', function(error) {

    // Note: we're in dangerous territory!
    // By definition, something unexpected occurred,
    // which we probably didn't want.
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

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
