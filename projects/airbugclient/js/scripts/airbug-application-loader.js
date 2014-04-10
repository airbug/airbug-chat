//-------------------------------------------------------------------------------
// Closure
//-------------------------------------------------------------------------------

(function(window) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var bugpack = require("bugpack");


    //-------------------------------------------------------------------------------
    // Script Functions
    //-------------------------------------------------------------------------------

    /**
     * @param {BugPackContext} bugpack
     */
    var startApplication = function(bugpack) {

        //-------------------------------------------------------------------------------
        // BugPack
        //-------------------------------------------------------------------------------

        var Application                 = bugpack.require("bugapp.Application");
        var AirbugClientApplication     = bugpack.require("airbug.AirbugClientApplication");


        //-------------------------------------------------------------------------------
        // Script
        //-------------------------------------------------------------------------------

        var application         = new AirbugClientApplication();
        window.application      = application;
        application.addEventListener(Application.EventTypes.STARTED, function (event) {
            console.log("Airbug client application successfully started");
        });
        application.addEventListener(Application.EventTypes.ERROR, function (event) {
            throw event.getData().error;
        });

        application.start();
    };


    //-------------------------------------------------------------------------------
    // Context
    //-------------------------------------------------------------------------------

    if (_appConfig.debug) {

        //NOTE BRN: In debug mode we need to load the bugpack-registry.json so that we can load all files individually

        bugpack.loadContext(_appConfig.staticUrl, function(error, bugpack) {
            if (!error) {
                bugpack.loadExports(["bugapp.Application", "airbug.AirbugClientApplication"], function(error) {
                    if (!error) {
                        startApplication(bugpack);
                    } else {
                        throw error;
                    }
                });
            } else {
                throw error;
            }
        });

    } else {

        // NOTE BRN: When we're not in debug mode, the classes have already been loaded in a separate file and placed
        // in the default context. So we can just jump right in and start requiring classes.

        bugpack.context("*", function (bugpack) {
            startApplication(bugpack);
        });
    }
})(window);
