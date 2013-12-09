//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('airbug.CurrentUser')
//@Require('airbug.CurrentUserModel')
//@Require('airbug.ManagerModule')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var TypeUtil            = bugpack.require('TypeUtil');
var CurrentUser         = bugpack.require('airbug.CurrentUser');
var CurrentUserModel    = bugpack.require('airbug.CurrentUserModel');
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

    _constructor: function(airbugApi, meldStore, meldBuilder, userManagerModule, navigationModule, bugCallRouter) {

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
        this.currentUser        = null;

        /**
         * @private
         * @type {null}
         */
        this.logger             = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule   = navigationModule;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule  = userManagerModule;
    },


    //-------------------------------------------------------------------------------
    // Configuration
    //-------------------------------------------------------------------------------

    configure: function() {
        var _this = this;
        var airbugApi = this.airbugApi;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            refreshConnectionForLogin: function(request, responder, callback) {
                var response = responder.response("Success", {});
                responder.sendResponse(response, function(error){
                    _this.currentUser = null;
                    airbugApi.refreshConnection();
                    callback(error);
                });
                //redirect to finalDesintation
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
             //NOTE: SUNG Does this need to be done on the server side to ensure disconnect.
             // If so, how do we deal with the default reconnect behavior?
            refreshConnectionForLogout: function(request, responder, callback) {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                console.log("CurrentUserManagerModule refreshConnectionForLogout route");
                var response = responder.response("Success", {});
                _this.currentUser = null;
                //do i need to wait for connection_established event?
                //ajax call -- http request made on socket connect. should replace cookie if session no longer exists.
                responder.sendResponse(response, function(error){
                    airbugApi.refreshConnection();
                    //Do I need to wait for connection_established to navigate?? CurrentUser may not be available.
                    //May need to add eventListener to airbugApi.bugCallClient.callClient
                    _this.navigationModule.navigate("login", {
                        trigger: true
                    });
                    callback(error);
                });

            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            refreshConnectionForRegister: function(request, responder, callback) {
                var response = responder.response("Success", {});
                responder.sendResponse(response, function(error){
                    _this.currentUser = null;
                    airbugApi.refreshConnection();
                    callback(error);
                });
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object=} dataObject
     * @param {MeldDocument=} currentUserMeldDocument
     * @returns {CurrentUserModel}
     */
    generateCurrentUserModel: function(dataObject, currentUserMeldDocument) {
        return new CurrentUserModel(dataObject, currentUserMeldDocument);
    },

    /**
     * @param {function(Throwable, CurrentUser)} callback
     */
    retrieveCurrentUser: function(callback) {

        console.log("CurrentUserManagerModule#retrieveCurrentUser");
        var _this       = this;
        console.log("currentUser:", this.currentUser);
        if (this.currentUser) {
            console.log("user already retrieved");
            console.log("currentUser:", this.currentUser);
            callback(null, this.currentUser);
        } else {
            this.request("retrieveCurrentUser", {}, function(throwable, callResponse) {
                console.log("CurrentUserManagerModule#retrieveCurrentUserDefault request retrieve CurrentUser callback");
                console.log("throwable:", throwable);
                console.log("callResponse:", callResponse);
                var data = callResponse.getData();
                console.log("data:", data);
                if (!throwable) {
                    var currentUserId   = data.objectId;
                    console.log("currentUserId:", currentUserId);
                    _this.retrieve("User", currentUserId, function(throwable, currentUserMeldDocument) {
                        if (!throwable) {
                            _this.currentUser = new CurrentUser(currentUserMeldDocument);
                            callback(null, _this.currentUser);
                        } else {
                            //TODO
                            callback(throwable);
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
     * @param {string} password
     * @param {function(Throwable)} callback
     */
    loginUser: function(email, password, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                $.ajax({
                    url: "/app/login",
                    type: "POST",
                    dataType: "json",
                    data: {email: email, password: password},
                    success: function(data, textStatus, req) {
                        if (data.responseType === "Success") {
                            flow.complete();
                        } else if (data.responseType === "Exception") {
                            var exceptionData = data.exception;

                            //TEST
                            console.log("BIG TEST - exceptionData:", exceptionData);

                            flow.error(new Exception(exceptionData.type, exceptionData.data, exceptionData.message));
                        } else {
                            _this.logger.error("Unhandled response type on login");
                        }
                    },
                    error: function(req, textStatus, errorThrown) {
                        if (TypeUtil.isString(errorThrown)) {
                            errorThrown = new Error(errorThrown);
                        }
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.complete(errorThrown);
                    }
                });
            }),
            $task(function(flow) {
                _this.currentUser = null;
                _this.airbugApi.refreshConnection();
                flow.complete();
            }),
            $task(function(flow) {
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
        var _this = this;
        $series([
            $task(function(flow) {
                $.ajax({
                    url: "/app/logout",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function(data, textStatus, req) {
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        var error = data.error;
                        flow.complete(error);
                    },
                    error: function(req, textStatus, errorThrown) {
                        if (TypeUtil.isString(errorThrown)) {
                            errorThrown = new Error(errorThrown);
                        }
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.error(errorThrown);
                    }
                });
            }),
            $task(function(flow) {
                _this.currentUser = null;
                _this.airbugApi.refreshConnection();
                flow.complete();
            })
        ]).execute(function(throwable) {
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
    registerUser: function(userObject, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
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
                    error: function(req, textStatus, errorThrown) {
                        if (TypeUtil.isString(errorThrown)) {
                            errorThrown = new Error(errorThrown);
                        }
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.complete(errorThrown);
                    }
                });
            }),
            $task(function(flow) {
                _this.currentUser = null;
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
