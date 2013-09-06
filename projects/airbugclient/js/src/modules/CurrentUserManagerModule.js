//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
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

var CurrentUserManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, meldObjectManagerModule, userManagerModule, roomManagerModule) {

        this._super(airbugApi, meldObjectManagerModule);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @type {string}
         */
        this.currentUserId      = null;

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
        this.currentUserId = null;
    },

    //-------------------------------------------------------------------------------
    //
    //-------------------------------------------------------------------------------

    /**
     * @return {meldbug.MeldObject || null}
     */
    getCurrentUser: function(){
        if(this.currentUserId){
            return this.get(this.currentUserId);
        } else {
            return null;
        }
    },

    /**
     * @return {boolean}
     */
    userIsLoggedIn: function(){
        var currentUser = this.getCurrentUser();
        if(currentUser){
            if(currentUser.email){
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
     * @param {function(error, meldbug.MeldObject)}
     */
    retrieveCurrentUser: function(callback){
        //NOTE: can the cached currentUserId be incorrect??
        var _this = this;
        var currentUser = this.getCurrentUser();
        if(currentUser){
            callback(null, currentUser);
        } else {
            this.request("retrieve", "CurrentUser", {}, function(error, currentUser){
                _this.currentUserId = currentUser._id;
                callback(error, currentUser);
            });
        }
    },

    /**
     * @param {{email: string}} userObj
     * @param {function(error, {*})} callback
     */
    loginUser: function(userObj, callback){
        var _this = this;
        $.ajax({
            url: "/app/login",
            type: "POST",
            dataType: "json",
            data: userObj,
            success: function(data, textStatus, req){
                console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                var user    = data.user; //TODO Needs updating
                var error   = data.error;
                if(!error && user){
                    _this.airbugApi.loginUser(function(error){
                        if(!error) _this.roomManagerModule.retrieveRooms(user.roomsList, function(error, rooms){
                            callback(error, user); //TODO
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
     * @param {function(error)} callback
     */
    logoutCurrentUser: function(callback){
        //TODO
        var _this = this;
        $series([
            // $task(function(flow){
            //     _this.airbugApi.logoutCurrentUser(function(error){
            //         if(!error){
            //             _this.meldObjectManagerModule.clearCache();
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

    /**
     * @param {{
            email: string,
            firstName: string,
            lastName: string}
        } userObj
     * @param {function(error, {})} callback
     */
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
                    //TODO Update
                    _this.airbugApi.registerUser(callback);
                } else {
                    callback(error, user);
                }
            },
            error: function(req, textStatus, errorThrown){
                console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                callback(errorThrown);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
