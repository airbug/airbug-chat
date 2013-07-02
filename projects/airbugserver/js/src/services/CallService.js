//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('CallService')

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.BugCallServerEvent')


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
var BugCallServerEvent  = bugpack.require('bugcall.BugCallServerEvent');


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
        this.userIdToCallManagerMap    = new DualMultiSetMap();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} userId
     * @return {Set.<CallManager>}
     */
    findCallManagerSetByUserId: function(userId) {
        var callManagerSet = this.userIdToCallManagerMap.get(userId);
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
        this.userIdToCallManagerMap.removeByValue(callManager);
    },

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(BugCallServerEvent.CALL_CLOSED, this.hearCallClosed, this);
        this.bugCallServer.on(BugCallServerEvent.CALL_OPENED, this.hearCallOpened, this);
    },

    /**
     * @param {string} userId
     * @param {CallManager} callManager
     */
    registerCallManager: function(userId, callManager) {
        this.userIdToCallManagerMap.put(userId, callManager);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {BugCallServerEvent} event
     */
    hearCallClosed: function(event) {
        var data            = event.getData();
        var callManager   = data.callManager;
        this.deregisterCallManager(callManager);
    },
    
    /**
     * @private
     * @param {BugCallServerEvent} event
     */
    hearCallOpened: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        var callConnection  = callManager.getConnection();
        var userId          = callConnection.getHandshake().session.userId;
        this.registerCallManager(userId, callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.CallService', CallService);
