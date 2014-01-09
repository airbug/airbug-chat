//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('CallService')
//@Autoload

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.CallEvent')
//@Require('bugioc.ArgAnnotation')
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
var DualMultiSetMap         = bugpack.require('DualMultiSetMap');
var Obj                     = bugpack.require('Obj');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IBuildRequestContext}
 */
var CallService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     */
    _constructor: function(bugCallServer) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {DualMultiSetMap.<string, CallManager>}
         */
        this.sessionSidToCallManagerMap      = new DualMultiSetMap();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // IBuildRequestContext Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable=)} callback
     */
    buildRequestContext: function(requestContext, callback) {
        var callManager = null;
        if (requestContext.getType() === RequestContext.Types.BUGCALL) {
            callManager = requestContext.getRequest().getCallManager();
        }
        requestContext.set("callManager", callManager);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {string} requestType
     * @param {Object} requestData
     * @param {function(Exception, CallResponse)} requestCallback
     */
    request: function(callManager, requestType, requestData, requestCallback) {
        this.bugCallServer.request(callManager, requestType, requestData, requestCallback);
    },

    /**
     * @param {string} sessionId
     * @return {Set.<CallManager>}
     */
    findCallManagerSetBySessionId: function(sessionId) {
        var callManagerSet = this.sessionSidToCallManagerMap.getValue(sessionId);
        if (callManagerSet) {
            return callManagerSet.clone();
        } else {
            return undefined;
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {CallManager} callManager
     */
    deregisterCallManager: function(callManager) {
        this.sessionSidToCallManagerMap.removeByValue(callManager);
    },

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(CallEvent.CLOSED, this.hearCallClosed, this);
        this.bugCallServer.on(CallEvent.OPENED, this.hearCallOpened, this);
    },

    /**
     * @param {string} sid
     * @param {CallManager} callManager
     */
    registerCallManager: function(sid, callManager) {
        this.sessionSidToCallManagerMap.put(sid, callManager);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearCallClosed: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        this.deregisterCallManager(callManager);
    },

    /**
     * @private
     * @param {CallEvent} event
     */
    hearCallOpened: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        var callConnection  = callManager.getConnection();
        var sessionId       = callConnection.getHandshake().sessionId;
        this.registerCallManager(sessionId, callManager);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallService, IBuildRequestContext);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallService).with(
    module("callService")
        .args([
            arg().ref("bugCallServer")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.CallService', CallService);
