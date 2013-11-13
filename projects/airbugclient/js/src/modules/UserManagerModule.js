//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} userId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    retrieveUser: function(userId, callback) {
        console.log("UserManagerModule#retrieveUser");
        this.retrieve("User", userId, callback);
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(Throwable, Map.<string, meldbug.MeldDocument>)} callback
     */
    retrieveUsers: function(userIds, callback) {
        this.retrieveEach("User", userIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserManagerModule", UserManagerModule);
