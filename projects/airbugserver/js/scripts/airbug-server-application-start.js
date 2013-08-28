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
airbugServerApplication.start(function(error) {
    console.log("Starting airbug server...");
    if (!error){
        console.log("Airbug server successfully started");
    } else {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    }
});
