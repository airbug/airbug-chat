//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConnectionService')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('socketio:server.SocketIoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Set     = bugpack.require('Set');
var SocketIoManager = bugpack.require('socketio:server.SocketIoManager')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConnectionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {SocketIoManager} socketIoManager
     */
    _constructor: function(socketIoManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SocketIoManager}
         */
        this.socketIoManager        = socketIoManager;

        /**
         * @private
         * @type {Map}
         */
        this.userToConnectionsMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.socketIoManager.on(SocketIoManager.EventTypes.CONNECTION, this.registerConnection);

        callback();
    },

    registerConnection: function(event){
        var socketIoConnection  = event.getData().socketConnection;
        var userId              = socketIoConnection.getsocket().handshake.session.user.id;
        var connectionUuid      = socketIoConnection.getUuid();
        var connections         = this.userToConnectionsMap.get(userUuid);

        if(!connections){
            connections = new Set([connectionUuid]);
        } else {
            connections.add(connectionUuid);
        }

        this.userToConnectionsMap.put(userUuid, connections);
    },

    /**
     * @param {} userId
     * @return {Array}
     */
    findConnectionsByUserId: function(userId){
        return this.userToConnectionsMap.get(userId).getValueArray();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConnectionService', ConnectionService);

