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

        /**
         * @type {RoomManagerModule}
         */
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
     * @param {function(error, currentUser)} callback
     */
     //NOTE TODO change to retrieveCurrentUser
    getCurrentUser: function(callback) {
        var _this = this;
        // TODO check cache
        this.airbugApi.getCurrentUser(function(error, currentUser){
            if(!error && currentUser){
                _this.updateCurrentUserAndRoomsList(currentUser, function(){
                    callback(error, currentUser);
                });
            } else {
                callback(error, currentUser);
            }
        });
    },

    loginUser: function(userObj, callback){
        var _this = this;
        this.airbugApi.loginUser(userObj, function(error, currentUser){
            console.log("error:", error, "currentUser:", currentUser);
            if(!error && currentUser){
                _this.updateCurrentUserAndRoomsList(currentUser, function(){
                    callback(error, currentUser);
                });
            } else {
                callback(error, currentUser);
            }
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
                _this.clearCache();
                _this.userManagerModule.clearCache();
                _this.roomManagerModule.clearCache();
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
                _this.updateCurrentUserAndRoomsList(currentUser, function(){
                    callback(error, currentUser);
                });
            } else {
                callback(error, currentUser);
            }
        });
    },

    /**
     * @private
     * @param {} currentUser
     * @param {function()} callback
     */
    updateCurrentUserAndRoomsList: function(currentUser, callback){
        var _this = this;
        var roomsList = currentUser.roomsList;
        var unretrievedRoomsList = [];
        this.currentUser = currentUser;
        this.userManagerModule.put(currentUser._id, currentUser);
        console.log("currentUser updated");
        roomsList.forEach(function(roomId){
            if(!_this.roomManagerModule.get(roomId)) unretrievedRoomsList.push(roomId);
        });
        if(unretrievedRoomsList.length > 0){
            this.roomManagerModule.retrieveRooms(unretrievedRoomsList, function(error, rooms){
                if(!error && rooms){
                    console.log("RetrievedRooms");
                } else {
                    console.log("Could not retrieveRooms");
                }
                callback();
            });
        } else {
            console.log("Rooms up to date");
            callback();
        }

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
