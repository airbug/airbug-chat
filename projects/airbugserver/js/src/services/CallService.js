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
        this.sessionIdToCallManagerMap      = new DualMultiSetMap();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} sessionId
     * @return {Set.<CallManager>}
     */
    findCallManagerSetBySessionId: function(sessionId) {
        var callManagerSet = this.sessionIdToCallManagerMap.getValue(sessionId);
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
        this.sessionIdToCallManagerMap.removeByValue(callManager);
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
     * @param {string} sessionId
     * @param {CallManager} callManager
     */
    registerCallManager: function(sessionId, callManager) {
        console.log("Inside CallService#registerCallManager");
        this.sessionIdToCallManagerMap.put(sessionId, callManager);
        console.log("sessionIdToCallManagerMap count:", this.sessionIdToCallManagerMap.getCount());
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
        console.log("xoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxox");
        console.log("Inside CallService#hearCallOpened");
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
