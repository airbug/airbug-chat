//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, userManagerModule, roomManagerModule) {

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

        /**
         * @type {UserManagerModule}
         */
        this.userManagerModule  = userManagerModule;

        this.roomManagerModule  = roomManagerModule;
    },


    clearCache: function(){
        this.currentUser = null;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    userIsLoggedIn: function(){
        if(this.currentUser){
            if(this.currentUser.email){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /**
     * @return {boolean}
     */
    userIsNotLoggedIn: function(){
        return !this.userIsLoggedIn();
    },

    //-------------------------------------------------------------------------------
    // Instance Methods
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
                _this.userManagerModule.put(currentUser._id, currentUser);
                console.log("currentUser updated");
            }
            callback(error, currentUser);
        });
    },

    /**
     * @param {function(error, currentUser)} callback
     */
    getCurrentUser: function(callback) {
        var _this = this;
        // TODO check cache
        this.airbugApi.getCurrentUser(function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                _this.userManagerModule.put(currentUser._id, currentUser);
                console.log("currentUser updated");
                //TODO:
                //update rooms
                // _this.roomManagerModule.updateRooms(currentUser.roomsList, function(error){
                //     if(!error){
                //         console.log("rooms updated");
                //     }
                // });
            }
            callback(error, currentUser);
        });
    },

    loginUser: function(userObj, callback){
        var _this = this;
        this.airbugApi.loginUser(userObj, function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                _this.userManagerModule.put(currentUser._id, currentUser);
                console.log("currentUser updated");
            }
            callback(error, currentUser);
        });
    },

    logoutCurrentUser: function(callback){
        //TODO
        var _this = this;
        this.airbugApi.logoutCurrentUser(function(error){
            if(!error){
                //TODO
                // delete session
                // Flush cached dataObjs in all modules
                // redirect to login screen
                _this.userManagerModule.clearCache();
                // this.roomManagerModule.clearCache();
                _this.clearCache();
                callback(error);
            } else {
                callback(error);
            }
        });

    },

    registerUser: function(userObj, callback){
        var _this = this;
        this.airbugApi.registerUser(userObj, function(error, currentUser){
            if(!error && currentUser){
                _this.currentUser = currentUser;
                _this.userManagerModule.put(currentUser._id, currentUser);
                console.log("currentUser updated");
            }
            callback(error, currentUser);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
