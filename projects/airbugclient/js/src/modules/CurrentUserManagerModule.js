//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.CurrentUserModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var CurrentUserModel    = bugpack.require('airbug.CurrentUserModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi          = airbugApi;

        /**
         * @type {CurrentUser}
         */
        this.currentUser        = null;

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {{
     *      email: string,
     *      firstName: string,
     *      lastName: string
     * }} userObj
     * @param {function(error, currentUser)} callback
     */
    establishCurrentUser: function(userObj, callback) {
        var _this = this;
        this.airbugApi.establishCurrentUser(userObj, function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                console.log("currentUser updated:", currentUser);
            }
            callback(error, currentUser);
        });
    },

    /**
     * @param {function(error, currentUser)} callback
     */
    getCurrentUser: function(callback) {
        var _this = this;
        console.log("Hello from inside CurrentUserManagerModule#getCurrentUser");
        this.airbugApi.getCurrentUser(function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                console.log("currentUser updated:", currentUser);
            }
            console.log("Error:", error, "currentUser:", currentUser);
            callback(error, currentUser);
        });
    },

    loginUser: function(userObj, callback){
        var _this = this;
        this.airbugApi.loginUser(userObj, function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                console.log("currentUser updated:", currentUser);
            }
            callback(error, currentUser);
        });
    },

    logoutUser: function(){
        //TODO
    },

    registerUser: function(userObj, callback){
        var _this = this;
        console.log("Inside of CurrentUserManagerModule#registerUser");
        this.airbugApi.registerUser(userObj, function(error, currentUser){
            console.log("Inside callback for airbugApi.registerUser inside of CurrentUserManagerModule#registerUser");
            console.log("Error:", error, "currentUser:", currentUser);
            if(!error && currentUser){
                _this.currentUser = currentUser;
                console.log("currentUser updated:", currentUser);
            }
            console.log("callback:", callback);
            callback(error, currentUser);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
