//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugCallService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var IProcessCall            = bugpack.require('bugcall.IProcessCall');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule       = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IBuildRequestContext}
 * @implements {IInitializeModule}
 * @implements {IProcessCall}
 */
var AirbugCallService = Class.extend(Obj, {

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
        var call = null;
        if (requestContext.getType() === RequestContext.Types.BUGCALL) {
            call = requestContext.getRequest().getCall();
        }
        requestContext.set("call", call);
        callback();
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
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
        // TODO BRN: We need to create a scheduled cleanup task for removing calls after they've dropped and haven't reconnected.

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
                    _this.airbugCallManager.createAirbugCall(call.getCallUuid(), sessionId, session.getUserId(), function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.error(new Exception("NotFound", {}, "Could not find session by the id - sessionId:" + sessionId));
                }
            })
        ]).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirbugCallService, IBuildRequestContext);
Class.implement(AirbugCallService, IInitializeModule);
Class.implement(AirbugCallService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugCallService).with(
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
