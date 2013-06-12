//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('airbugserver.AirbugApplication')


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AirbugApplication = bugpack.require('airbugserver.AirbugApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var airbugApplication = new AirbugApplication();
airbugApplication.start(function(error) {
    console.log("Starting airbug server...");
    if (!error){
        console.log("Airbug server successfully started");
    } else {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    }
});
