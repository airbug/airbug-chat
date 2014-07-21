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

//@Export('airbugserver.AirbugCallService')
//@Autoload

//@Require('Class')
//@Require('EntityService')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugcall.IncomingRequest')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IBuildRequestContext')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var EntityService           = bugpack.require('EntityService');
    var Exception               = bugpack.require('Exception');
    var Flows                   = bugpack.require('Flows');
    var Obj                     = bugpack.require('Obj');
    var CallEvent               = bugpack.require('bugcall.CallEvent');
    var IProcessCall            = bugpack.require('bugcall.IProcessCall');
    var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var IBuildRequestContext    = bugpack.require('bugrequest.IBuildRequestContext');


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
     * @extends {EntityService}
     * @implements {IBuildRequestContext}
     * @implements {IInitializingModule}
     * @implements {IProcessCall}
     */
    var AirbugCallService = Class.extend(EntityService, {

        _name: "airbugserver.AirbugCallService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {BugCallServer} bugCallServer
         * @param {AirbugCallManager} airbugCallManager
         * @param {SessionManager} sessionManager
         * @param {AirbugCallPusher} airbugCallPusher
         */
        _constructor: function(logger, bugCallServer, airbugCallManager, sessionManager, airbugCallPusher) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugCallManager}
             */
            this.airbugCallManager          = airbugCallManager;

            /**
             * @private
             * @type {AirbugCallPusher}
             */
            this.airbugCallPusher           = airbugCallPusher;

            /**
             * @private
             * @type {BugCallServer}
             */
            this.bugCallServer              = bugCallServer;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                     = logger;

            /**
             * @private
             * @type {SessionManager}
             */
            this.sessionManager             = sessionManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugCallManager}
         */
        getAirbugCallManager: function() {
            return this.airbugCallManager;
        },

        /**
         * @return {AirbugCallPusher}
         */
        getAirbugCallPusher: function() {
            return this.airbugCallPusher;
        },

        /**
         * @return {BugCallServer}
         */
        getBugCallServer: function() {
            return this.bugCallServer;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {SessionManager}
         */
        getSessionManager: function() {
            return this.sessionManager;
        },


        //-------------------------------------------------------------------------------
        // IBuildRequestContext Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {function(Throwable=)} callback
         */
        buildRequestContext: function(requestContext, callback) {
            var call        = null;
            var request     = requestContext.getRequest();
            if (Class.doesExtend(request, IncomingRequest)) {
                call = request.getCall();
            }
            requestContext.set("call", call);
            callback();
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            this.bugCallServer.deregisterCallProcessor(this);
            this.bugCallServer.off(CallEvent.CLOSED, this.hearCallClosed, this);
            this.bugCallServer.off(CallEvent.OPENED, this.hearCallOpened, this);
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            this.bugCallServer.registerCallProcessor(this);
            this.bugCallServer.on(CallEvent.CLOSED, this.hearCallClosed, this);
            this.bugCallServer.on(CallEvent.CLOSED, this.hearCallOpened, this);
            callback();
        },


        //-------------------------------------------------------------------------------
        // IProcessCall Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Call} call
         * @param {function(Throwable=)} callback
         */
        processCall: function(call, callback) {
            var _this           = this;
            var callConnection  = call.getConnection();
            var sessionId       = callConnection.getHandshake().sessionId;
            var session         = null;
            $series([
                $task(function(flow) {
                    _this.sessionManager.retrieveSessionBySid(sessionId, function(throwable, returnedSession) {
                        if (!throwable) {
                            session = returnedSession;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    if (session) {
                        var airbugCall = _this.airbugCallManager.generateAirbugCall({
                            callType: call.getCallType(),
                            callUuid: call.getCallUuid(),
                            open: call.isOpen(),
                            sessionId: sessionId,
                            userId: session.getUserId()
                        });
                        _this.airbugCallManager.createAirbugCall(airbugCall, function(throwable) {
                            flow.complete(throwable);
                        });
                    } else {
                        flow.error(new Exception("NotFound", {}, "Could not find session by the id - sessionId:" + sessionId));
                    }
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Service Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {string} airbugCallId
         * @param {function(Throwable, AirbugCall=)} callback
         */
        retrieveAirbugCall: function(requestContext, airbugCallId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            /** @type {AirbugCall} */
            var airbugCall          = null;

            this.logger.debug("Starting retrieveAirbugCall - airbugCallId:", airbugCallId);
            $series([
                $task(function(flow) {
                    _this.dbRetrieveAirbugCall(airbugCallId, function(throwable, returnedAirbugCall){
                        if (!throwable) {
                            if (returnedAirbugCall) {
                                airbugCall = returnedAirbugCall;
                                flow.complete();
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find AirbugCall by the id '" + airbugCallId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.airbugCallPusher.meldCallWithAirbugCall(call.getCallUuid(), airbugCall, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.airbugCallPusher.pushAirbugCallToCall(airbugCall, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, airbugCall);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {RequestContext} requestContext
         * @param {Array.<string>} airbugCallIds
         * @param {function(Throwable, Map.<string, AirbugCall>=)} callback
         */
        retrieveAirbugCalls: function(requestContext, airbugCallIds, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var airbugCallMap       = null;

            $series([
                $task(function(flow) {
                    _this.dbRetrieveAirbugCalls(airbugCallIds, function(throwable, returnedAirbugCallMap) {
                        if (!throwable) {
                            airbugCallMap = returnedAirbugCallMap;
                            if (!airbugCallMap) {
                                throwable = new Exception("NotFound", {}, "Could not find any AirbugCalls with the ids '" + airbugCallIds + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.airbugCallPusher.meldCallWithAirbugCalls(call.getCallUuid(), airbugCallMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.airbugCallPusher.pushAirbugCallsToCall(airbugCallMap.getValueArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, airbugCallMap);
                } else {
                    callback(throwable);
                }
            });
        },


        // Private Database Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} airbugCallId
         * @param {function(Throwable, AirbugCall=)} callback
         */
        dbRetrieveAirbugCall: function(airbugCallId, callback) {
            this.airbugCallManager.retrieveAirbugCall(airbugCallId, callback);
        },

        /**
         * @private
         * @param {string} callUuid
         * @param {function(Throwable, AirbugCall=)} callback
         */
        dbRetrieveAirbugCallByCallUuid: function(callUuid, callback) {
            this.airbugCallManager.retrieveAirbugCallByCallUuid(callUuid, callback);
        },

        /**
         * @private
         * @param {Array.<string>} airbugCallIds
         * @param {function(Throwable, Map.<string, AirbugCall>=)} callback
         */
        dbRetrieveAirbugCalls: function(airbugCallIds, callback) {
            this.airbugCallManager.retrieveAirbugCalls(airbugCallIds, callback);
        },

        /**
         * @param {string} callUuid
         * @param {{
         *      open: boolean
         * }} updateObject
         * @param {function(Throwable, AirbugCall=)} callback
         */
        doUpdateAirbugCallByCallUuid: function(callUuid, updateObject, callback) {
            var _this               = this;
            /** @type {AirbugCall} */
            var airbugCall          = null;

            $series([
                $task(function(flow) {
                    _this.dbRetrieveAirbugCallByCallUuid(callUuid, function(throwable, returnedAirbugCall) {
                        if (!throwable) {
                            if (returnedAirbugCall) {
                                airbugCall = returnedAirbugCall;
                                flow.complete();
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find AirbugCall with the callUuid '" + callUuid + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    if (Obj.hasProperty(updateObject, "open")) {
                        airbugCall.setOpen(updateObject.open);
                    }
                    flow.complete();
                }),
                $task(function(flow) {
                    _this.airbugCallManager.updateAirbugCall(airbugCall, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.airbugCallPusher.pushAirbugCall(user, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, airbugCall);
                } else {
                    callback(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallEvent} event
         */
        hearCallClosed: function(event) {
            var _this           = this;
            var data            = event.getData();
            var call            = data.call;
            this.doUpdateAirbugCallByCallUuid(call.getCallUuid(), {open: false}, function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        },

        /**
         * @private
         * @param {CallEvent} event
         */
        hearCallOpened: function(event) {
            var _this           = this;
            var data            = event.getData();
            var call            = data.call;
            this.doUpdateAirbugCallByCallUuid(call.getCallUuid(), {open: true}, function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            })
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AirbugCallService, IBuildRequestContext);
    Class.implement(AirbugCallService, IInitializingModule);
    Class.implement(AirbugCallService, IProcessCall);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugCallService).with(
        module("airbugCallService")
            .args([
                arg().ref("bugCallServer"),
                arg().ref("airbugCallManager"),
                arg().ref("sessionManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugCallService', AirbugCallService);
});
