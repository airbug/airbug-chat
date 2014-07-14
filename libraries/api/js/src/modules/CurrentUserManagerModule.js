/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CurrentUserManagerModule')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('TypeUtil')
//@Require('airbug.CurrentUser')
//@Require('airbug.ManagerModule')
//@Require('bugcall.ResponseEvent')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Flows                   = bugpack.require('Flows');
    var TypeUtil                = bugpack.require('TypeUtil');
    var CurrentUser             = bugpack.require('airbug.CurrentUser');
    var ManagerModule           = bugpack.require('airbug.ManagerModule');
    var ResponseEvent           = bugpack.require('bugcall.ResponseEvent');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var CurrentUserManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.CurrentUserManagerModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AirbugApi} airbugApi
         * @param {MeldStore} meldStore
         * @param {MeldBuilder} meldBuilder
         * @param {UserManagerModule} userManagerModule
         * @param {NavigationModule} navigationModule
         * @param {BugCallRouter} bugCallRouter
         * @param {Logger} logger
         * @param {Marshaller} marshaller
         */
        _constructor: function(airbugApi, meldStore, meldBuilder, userManagerModule, navigationModule, bugCallRouter, logger, marshaller) {

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
            this.logger             = logger;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller         = marshaller;

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
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {NavigationModule}
         */
        getNavigationModule: function() {
            return this.navigationModule;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var _this = this;
            var airbugApi = this.getAirbugApi();
            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                refreshConnectionForLogin: function(request, responder, callback) {
                    var response = responder.response("Success", {});
                    responder.sendResponse(response, function(throwable, outgoingResponse) {
                        if (!throwable) {
                            _this.currentUser = null;
                            airbugApi.refreshConnection(callback);
                        } else {
                            callback(throwable);
                        }
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                //NOTE: SUNG Does this need to be done on the server side to ensure disconnect.
                // If so, how do we deal with the default reconnect behavior?
                refreshConnectionForLogout: function(request, responder, callback) {
                    console.log("CurrentUserManagerModule refreshConnectionForLogout route");
                    var response = responder.response("Success", {});
                    _this.currentUser = null;

                    responder.sendResponse(response, function(throwable, outgoingResponse) {
                        if (!throwable) {
                            if (outgoingResponse.isSent()) {
                                _this.refreshConnectionAndNavigateHome(callback);
                            } else {
                                outgoingResponse.on(ResponseEvent.Types.SENT, function(event) {
                                    _this.refreshConnectionAndNavigateHome(callback);
                                });
                            }
                        } else {
                            callback(throwable);
                        }
                    });

                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                refreshConnectionForRegister: function(request, responder, callback) {
                    var response = responder.response("Success", {});
                    responder.sendResponse(response, function(throwable, outgoingResponse) {
                        if (!throwable) {
                            _this.currentUser = null;
                            airbugApi.refreshConnection(callback);
                        } else {
                            callback(throwable);
                        }
                    });
                }
            });
            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable, CurrentUser=)} callback
         */
        retrieveCurrentUser: function(callback) {
            var _this       = this;
            if (this.currentUser) {
                callback(null, this.currentUser);
            } else {
                this.request("retrieveCurrentUser", {}, function(throwable, callResponse) {
                    if (!throwable) {
                        var data = callResponse.getData();
                        var currentUserId   = data.objectId;
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
                        url: "/api/login",
                        type: "POST",
                        dataType: "json",
                        data: {email: email, password: password},
                        success: function(data, textStatus, req) {
                            var responseType = data.responseType;
                            if(responseType === "Success") {
                                flow.complete();
                            } else if (responseType === "Exception") {
                                var exceptionData = _this.marshaller.unmarshalData(data.exception);
                                flow.error(new Exception(exceptionData.type, exceptionData.data, exceptionData.message));
                            } else if (responseType === "Error") {
                                //TODO
                                var errorData = _this.marshaller.unmarshalData(data.error);
                                flow.error(new Error(errorData.message));
                            } else {
                                flow.error(new Error("Unknown response type"));
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
                    _this.airbugApi.refreshConnection(function(throwable) {
                        flow.complete(throwable);
                    });
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
                        url: "/api/logout",
                        type: "POST",
                        dataType: "json",
                        data: {
                            callUuid: _this.getAirbugApi().getCallUuid()
                        },
                        success: function(data, textStatus, req) {
                            console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                            var responseType = data.responseType;
                            if(responseType === "Success") {
                                flow.complete();
                            } else if (responseType === "Exception") {
                                var exceptionData = _this.marshaller.unmarshalData(data.exception);
                                flow.error(new Exception(exceptionData.type, exceptionData.data, exceptionData.message));
                            } else if (responseType === "Error") {
                                //TODO
                                var errorData = _this.marshaller.unmarshalData(data.error);
                                flow.error(new Error(errorData.message));
                            } else {
                                flow.error(new Error("Unknown response type"));
                            }
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
                    _this.airbugApi.refreshConnection(function(throwable) {
                        flow.complete(throwable);
                    });
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
                        url: "/api/register",
                        type: "POST",
                        dataType: "json",
                        data: userObject,
                        success: function(data, textStatus, req) {
                            console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                            var responseType = data.responseType;
                            if(responseType === "Success") {
                                flow.complete();
                            } else if (responseType === "Exception") {
                                var exceptionData = _this.marshaller.unmarshalData(data.exception);
                                flow.error(new Exception(exceptionData.type, exceptionData.data, exceptionData.message));
                            } else if (responseType === "Error") {
                                //TODO
                                var errorData = _this.marshaller.unmarshalData(data.error);
                                flow.error(new Error(errorData.message));
                            } else {
                                flow.error(new Error("Unknown response type"));
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
                    _this.airbugApi.refreshConnection(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.retrieveCurrentUser(function(throwable, currentUser) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        refreshConnectionAndNavigateHome: function(callback) {
            var _this = this;
            this.getAirbugApi().refreshConnection(function(throwable) {
                _this.getNavigationModule().navigate("", {
                    trigger: true
                });
                callback(throwable);
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CurrentUserManagerModule, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CurrentUserManagerModule).with(
        module("currentUserManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder"),
                arg().ref("userManagerModule"),
                arg().ref("navigationModule"),
                arg().ref("bugCallRouter"),
                arg().ref("logger"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
});
