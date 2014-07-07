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
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
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
    var Exception               = bugpack.require('Exception');
    var Obj                     = bugpack.require('Obj');
    var CallEvent               = bugpack.require('bugcall.CallEvent');
    var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
    var IProcessCall            = bugpack.require('bugcall.IProcessCall');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var IInitializingModule       = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag        = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var IBuildRequestContext    = bugpack.require('bugrequest.IBuildRequestContext');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IBuildRequestContext}
     * @implements {IInitializingModule}
     * @implements {IProcessCall}
     */
    var AirbugCallService = Class.extend(Obj, {

        _name: "airbugserver.AirbugCallService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCallServer} bugCallServer
         * @param {AirbugCallManager} airbugCallManager
         * @param {SessionManager} sessionManager
         */
        _constructor: function(bugCallServer, airbugCallManager, sessionManager) {

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
             * @type {BugCallServer}
             */
            this.bugCallServer              = bugCallServer;

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
         * @return {BugCallServer}
         */
        getBugCallServer: function() {
            return this.bugCallServer;
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
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            this.bugCallServer.registerCallProcessor(this);

            // NOTE BRN: We don't unprocess the call when it's closed because it's possible that it could reconnect later.
            // TODO BRN: When a call drops, we should move if from the primary AirbugCall set to a "deactivated" call set.
            // We should also undo the look up mappings so that they do not interfere with status calculations. If the
            // call reconnects, simply re-add the call back to the active AirbugCall set in redis

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
         * @param {string} callUuid
         * @param {function(Throwable, AirbugCall=)} callback
         */
        retrieveAirbugCall: function(requestContext, callUuid, callback) {

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
