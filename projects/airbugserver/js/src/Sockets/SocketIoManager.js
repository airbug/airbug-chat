//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketIoManager')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugflow.BugFlow')
//@Require('socketio:server.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var io              = require('socket.io');


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var SocketIoConnection  = bugpack.require('socketio:server.SocketIoConnection');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoServer, namespace) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.ioManager = socketIoServer.of(namespace);

        /**
         * @private
         * @type {SocketIoServer}
         */
        this.socketIoServer  = socketIoServer;

        /**
         * @private
         * @type {Map.<string, SocketIoConnection>}
         */
        this.socketUuidToSocketConnectionMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    getIoManager: function(){
        return this.ioManager;
    },

    /**
     * @param {string} socketUuid
     * @return {SocketIoConnection}
     */
    getSocketConnection:function(socketUuid) {
        return this.socketUuidToSocketConnectionMap.get(socketUuid);
    },

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        var _this = this;
        this.ioManager.on("connection", function(socket) {
            var socketConnection = new SocketIoConnection(socket);
            socketConnection.on(SocketIoConnection.EventTypes.DISCONNECT, _this.hearSocketDisconnect, _this);
            _this.socketUuidToSocketConnectionMap.put(socketConnection.getUuid(), socketConnection);
            _this.dispatchEvent(new Event(SocketIoManager.EventTypes.CONNECTION, {
                socket: socketConnection
            }));
        });

        callback();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     *
     * @param event
     */
    hearSocketDisconnect: function(event) {
        var socketConnection = event.getTarget();
        this.socketUuidToSocketConnectionMap.remove(socketConnection.getUuid());
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoManager.EventTypes = {
    CONNECTION: "SocketIoManager:Connection"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketIoManager', SocketIoManager);
