//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('TypeUtil')
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
var TypeUtil            = bugpack.require('TypeUtil');
var ManagerModule       = bugpack.require('airbug.ManagerModule');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, meldStore, userManagerModule, bugCallRouter) {

        this._super(airbugApi, meldStore);


        //-------------------------------------------------------------------------------
        // Declare Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter      = bugCallRouter;

        /**
         * @private
         * @type {string}
         */
        this.currentUserId      = null;

        /**
         * @private
         * @type {airbug.UserManagerModule}
         */
        this.userManagerModule  = userManagerModule;
    },

    //-------------------------------------------------------------------------------
    // Configuration
    //-------------------------------------------------------------------------------

    configure: function(){
        var _this = this;
        var airbugApi = this.airbugApi;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            refreshConnectionForLogin: function(request, responder){
                var data                = request.getData();
                airbugApi.resetConnection();
                responder.response();
                // What is the current state. What page is the person on? Login page? 
                // Were they redirected there because they weren't logged in?
                // If so, where do we forward them back to?
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
             //NOTE: SUNG Does this need to be done on the server side to ensure disconnect.
             // If so, how do we deal with the default reconnect behavior?
            refreshConnectionForLogout: function(request, responder) {
                var data                = request.getData();
                airbugApi.resetConnection();
                responder.response();
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            refreshConnectionForRegister: function(request, responder) {
                var data                = request.getData();
                airbugApi.resetConnection();
                responder.response();
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {meldbug.MeldDocument}
     */
    getCurrentUser: function() {
        if (this.currentUserId) {
            return this.get(this.currentUserId);
        } else {
            return null;
        }
    },

    /**
     * @return {string}
     */
    getCurrentUserId: function() { //needs to be changed to meldKey
        return this.currentUserId;
    },

    /**
     * @param {{*}} user
     * @return {boolean}
     */
    userIsAnonymous: function(user){
        if(user.email && !user.anonymous){
            return true;
        } else {
            return false;
        }
    },

    /**
     * @param {?{*}=} user
     * @return {boolean}
     */
    userIsLoggedIn: function(user) {
        var currentUser = undefined;
        if (!userMeldDocument) {
            currentUser = this.getCurrentUser();
        } else {
            currentUser = user;
        }
        if (currentUser) {
            return this.userIsNotAnonymous(currentUser);
        } else {
            return false;
        }
    },

    /**
     * @param {{*}} user
     * @return {boolean}
     */
    userIsNotAnonymous: function(user){
        return !this.userIsAnonymous(user);
    },

    /**
     * @param {?{*}=} userObject
     * @return {boolean}
     */
    userIsNotLoggedIn: function(userObject){
        return !this.userIsLoggedIn(userObject);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, meldbug.MeldDocument, boolean)} callback
     */
    retrieveCurrentUser: function(callback) {
        // TODO refactor this so that currentUserManagerModule checks for socket RequestFailedException
        // if (this.currentUserId) {
            this.retrieveCurrentUserDefault(callback);
        // } else {
        //     this.retrieveCurrentUserWithAjax(callback);
        // }
    },

    /**
     * @param {function(Throwable, meldbug.MeldDocument, boolean)} callback
     */
    retrieveCurrentUserDefault: function(callback) {
        //NOTE: can the cached currentUserId be incorrect??
        var _this       = this;
        var currentUser = this.getCurrentUser();
        if (currentUser) {
            callback(null, currentUser, this.userIsLoggedIn(currentUser));
        } else {
            this.request("retrieve", "CurrentUser", {}, function(throwable, data) {
                if (!throwable) {
                    var currentUserId   = data.objectId;
                    _this.retrieve("User", currentUserId, function(throwable, currentUserMeldDocument) {
                        callback(throwable, currentUserMeldDocument, _this.userIsLoggedIn(currentUserMeldDocument.generateObject()));
                    });
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @param {function(Throwable, {*}, boolean)} callback
     */
    // retrieveCurrentUserWithAjax: function(callback){
    //     var _this = this;
    //     $.ajax({
    //         url: "/app/retrieveCurrentUser",
    //         type: "GET",
    //         dataType: "json",
    //         data: {},
    //         success: function(data, textStatus, req){
    //             console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
    //             var currentUser = data.currentUser;
    //             var error       = data.error;
    //             if (!error) {
    //                 if(currentUser){
    //                     if(_this.userIsLoggedIn(currentUser)){
    //                         _this.airbugApi.loginUser(function(throwable){ //connects socket
    //                             if (!throwable) { //connected
    //                                 _this.retrieveCurrentUserDefault(callback);
    //                             } else { //not connected
    //                                 callback(undefined, currentUser, true);
    //                             }
    //                         });
    //                     } else {
    //                         callback(null, currentUser, false);
    //                     }
    //                 } else {
    //                         callback(null, null, false)
    //                 }
    //             } else {
    //                 //TODO
    //                 callback(error, currentUser, _this.userIsLoggedIn(currentUser));
    //             }
    //         },
    //         error: function(req, textStatus, errorThrown){
    //             console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
    //             callback(errorThrown);
    //         }
    //     });
    // },

    /**
     * @param {{email: string}} userObject
     * @param {function(Throwable, {*})} callback
     */
    loginUser: function(userObject, callback){
        var _this = this;
        $series([
            $task(function(flow){
                $.ajax({
                    url: "/app/login",
                    type: "POST",
                    dataType: "json",
                    data: userObject,
                    success: function(data, textStatus, req){
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        // var user    = data.user;
                        var error   = data.error;
                        flow.complete(error);
                    },
                    error: function(req, textStatus, errorThrown){
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.complete(errorThrown);
                    }
                });
            })
            // ,
            // $task(function(flow){
            //     _this.airbugApi.refreshConnection();
            //     flow.complete();
            // })
            ,
            $task(function(flow){
                _this.airbugApi.connect();
                flow.complete();
            }),
            $task(function(flow){
                _this.retrieveCurrentUser(function(throwable, meldDocument, loggedIn){
                    if(meldDocument){
                        var user = meldDocument.generateObject();
                        //TODO Refactor this so that the meldkey is passed through the retrieve callback
                        var meldKey = _this.meldBuilder.generateMeldKey("User", user.id, "owner");
                        _this.currentUserId = meldKey;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable);
        });
    },

    /**
     * @param {function(Throwable)} callback
     */
    logout: function(callback) {
        //TODO
        var _this = this;
        $series([
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
        ]).execute(function(throwable){
            if (throwable) {
                throwable = throwable.toString();
            }
            callback(throwable);
        });
    },

    /**
     * @param {{
            email: string,
            firstName: string,
            lastName: string}
        } userObject
     * @param {function(Throwable, {*})} callback
     */
    registerUser: function(userObject, callback){
        var _this = this;
        $series([
            $task(function(flow){
                $.ajax({
                    url: "/app/register",
                    type: "POST",
                    dataType: "json",
                    data: userObject,
                    success: function(data, textStatus, req){
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        // var user    = data.user;
                        var error   = data.error;
                        flow.complete(error);
                    },
                    error: function(req, textStatus, errorThrown){
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.complete(errorThrown);
                    }
                });
            })
            // ,
            // $task(function(flow){
            //     _this.airbugApi.refreshConnection();
            //     flow.complete();
            // })
            ,
            $task(function(flow){
                _this.airbugApi.connect();
                flow.complete();
            }),
            $task(function(flow){
                _this.retrieveCurrentUser(function(throwable, meldDocument, loggedIn){
                    if(meldDocument){
                        var user = meldDocument.generateObject();
                        //TODO Refactor this so that the meldkey is passed through the retrieve callback
                        var meldKey = _this.meldBuilder.generateMeldKey("User", user.id, "owner");
                        _this.currentUserId = meldKey;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
