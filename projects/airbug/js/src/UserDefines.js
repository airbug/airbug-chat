//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.UserDefines')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var UserDefines = {};


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    UserDefines.Status = {
        ACTIVE: "active",
        HEADSDOWN: "headsdown",
        OFFLINE: "offline"
    };

    /**
     * @static
     * @const {Date}
     */
    UserDefines.TOS_Date = new Date("December 14, 2013");


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserDefines", UserDefines);
});
