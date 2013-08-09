//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


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
        $.ajax({
            url: "/app/login",
            type: "POST",
            dataType: "json",
            data: userObj,
            success: function(data, textStatus, req){
                console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                var user = data.user;
                var error = data.error;
                if(!error && user){
                    _this.airbugApi.loginUser(function(){
                        _this.updateCurrentUserAndRoomsList(user, function(){
                            callback(error, user);
                        });
                    });
                } else {
                    callback(error, user);
                }
            },
            error: function(req, textStatus, errorThrown){
                console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                callback(errorThrown);
            }
        });
    },

    logoutCurrentUser: function(callback){
        //TODO
        var _this = this;
        $series([
            // $task(function(flow){
            //     _this.airbugApi.logoutCurrentUser(function(error){
            //         if(!error){
            //             _this.clearCache();
            //             _this.userManagerModule.clearCache();
            //             _this.roomManagerModule.clearCache();
            //             flow.complete();
            //         } else {
            //             flow.error(error);
            //         }
            //     });
            // }),
            $task(function(flow){
                $.ajax({
                    url: "/app/logout",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function(data, textStatus, req){
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        var error = data.error;
                        flow.complete(error);
                    },
                    error: function(req, textStatus, errorThrown){
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.error(errorThrown);
                    }
                });
            })
        ]).execute(function(error){
            if(error) var error = error.toString();
            callback(error);
        });
    },

    registerUser: function(userObj, callback){
        var _this = this;
        $.ajax({
            url: "/app/register", // should it be "/app/register" ?
            type: "POST",
            dataType: "json",
            data: userObj,
            success: function(data, textStatus, req){
                console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                var user = data.user;
                var error = data.error;
                if(!error && user){
                    _this.airbugApi.registerUser(function(){
                        _this.updateCurrentUserAndRoomsList(user, function(){
                            callback(error, user);
                        });
                    });
                } else {
                    callback(error, user);
                }
            },
            error: function(req, textStatus, errorThrown){
                console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                callback(errorThrown);
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
        var roomsList = currentUser.roomsList || [];
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
