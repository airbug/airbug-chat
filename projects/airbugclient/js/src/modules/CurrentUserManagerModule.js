//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.CurrentUser')
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
var CurrentUser         = bugpack.require('airbug.CurrentUser');
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

    _constructor: function(airbugApi, meldStore, meldBuilder, userManagerModule, bugCallRouter) {

        this._super(airbugApi, meldStore, meldBuilder);


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
         * @type {CurrentUser}
         */
        this.currentUser        = undefined;

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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, CurrentUser)} callback
     */
    retrieveCurrentUser: function(callback) {

        console.log("CurrentUserManagerModule#retrieveCurrentUser");
        var _this       = this;
        console.log("currentUser:", this.currentUser);
        if (this.currentUser) {
            callback(undefined, this.currentUser);
        } else {
            this.request("retrieve", "CurrentUser", {}, function(throwable, callResponse) {
                console.log("CurrentUserManagerModule#retrieveCurrentUserDefault request retrieve CurrentUser callback");
                console.log("throwable:", throwable);
                console.log("callResponse:", callResponse);
                var data = callResponse.getData();
                console.log("data:", data);
                if (!throwable) {
                    var currentUserId   = data.objectId;
                    console.log("currentUserId:", currentUserId);
                    _this.retrieve("User", currentUserId, "owner", function(throwable, currentUserMeldDocument) {
                        if (!throwable) {
                            _this.currentUser = new CurrentUser(currentUserMeldDocument);
                            callback(undefined, _this.currentUser);
                        }
                    });
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @param {string} email
     * @param {function(Throwable)} callback
     */
    loginUser: function(email, callback) {
        var _this = this;
        $series([
            $task(function(flow){
                $.ajax({
                    url: "/app/login",
                    type: "POST",
                    dataType: "json",
                    data: {email: email},
                    success: function(data, textStatus, req) {
                        console.log("LoginUser ajax call success");
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        flow.complete();
                    },
                    error: function(req, textStatus, errorThrown) {
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.complete(errorThrown);
                    }
                });
            }),
            $task(function(flow){
                _this.currentUser = undefined;
                _this.airbugApi.refreshConnection();
                flow.complete();
            }),
            $task(function(flow){
                console.log("CurrentUserManagerModule#loginUser retrieving current user");
                _this.retrieveCurrentUser(function(throwable, currentUser) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
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
     *     email: string,
     *     firstName: string,
     *     lastName: string
     * }} userObject
     * @param {function(Throwable, *)} callback
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
                    success: function(data, textStatus, req) {
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
            }),
            $task(function(flow) {
                _this.currentUser = undefined;
                _this.airbugApi.refreshConnection();
                flow.complete();
            }),
            $task(function(flow) {
                _this.retrieveCurrentUser(function(throwable, currentUser) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
