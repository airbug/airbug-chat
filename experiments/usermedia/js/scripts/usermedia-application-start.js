//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Require('usermedia.UserMediaServerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UserMediaServerApplication = bugpack.require('usermedia.UserMediaServerApplication');


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

var userMediaServerApplication = new UserMediaServerApplication();
userMediaServerApplication.start(function(error){
    console.log("Starting UserMedia server...");
    if (!error){
        console.log("UserMedia successfully started");
    } else {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    }
});
