//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('CallService')

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.CallEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var DualMultiSetMap     = bugpack.require('DualMultiSetMap');
var Obj                 = bugpack.require('Obj');
var CallEvent           = bugpack.require('bugcall.CallEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

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
    // Public Instance Methods
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
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallManager} callManager
     */
    deregisterCallManager: function(callManager) {
        this.sessionSidToCallManagerMap.removeByValue(callManager);
    },

    /**
     * @private
     */
    initialize: function() {
        console.log("Inside CallService#initialize");
        this.bugCallServer.on(CallEvent.CLOSED, this.hearCallClosed, this);
        this.bugCallServer.on(CallEvent.OPENED, this.hearCallOpened, this);
    },

    /**
     * @param {string} sid
     * @param {CallManager} callManager
     */
    registerCallManager: function(sid, callManager) {
        console.log("Inside CallService#registerCallManager");
        this.sessionSidToCallManagerMap.put(sid, callManager);
        console.log("sessionSidToCallManagerMap count:", this.sessionSidToCallManagerMap.getCount());
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearCallClosed: function(event) {
        console.log("Inside CallService#hearCallClosed");
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.CallService', CallService);
