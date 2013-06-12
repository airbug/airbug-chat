//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AlphaSocketIoManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Proxy')
//@Require('socketio:socket.SocketIoConnection')
//@Require('socketio:server.SocketIoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var io          = require('socket.io');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Proxy               = bugpack.require('Proxy');
var SocketIoConnection  = bugpack.require('socketio:socket.SocketIoConnection');
var SocketIoManager     = bugpack.require('socketio:server.SocketIoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AlphaSocketIoManager = Class.extend(Obj, {

    _constructor: function(socketIoServer, namespace, socketsMap) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.ioManager                          = socketIoServer.of(namespace);

        /**
         * @private
         * @type {SocketIoServer}
         */
        this.socketIoServer                     = socketIoServer;

        /**
         * @private
         * @type {Map.<string, SocketIoConnection>}
         */
        this.socketUuidToSocketConnectionMap    = new Map();

        /*
         * @type {SocketsMap}
         **/
        this.socketsMap                         = socketsMap;

        Proxy.proxy(this, this.socketsMap, [
            'associateUserSessionAndSocket',
            'findUserBySession'
        ])
    },


    /**
     * @override
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        var _this = this;
        this.ioManager.on("connection", function(socket) {
            console.log("Connection established"); //For Debugging
            console.log("session:", socket.handshake.session); //For Debugging

            var socketConnection = new SocketIoConnection(socket);
            var session = socket.handshake.session;
            // var cookie = socket.handshake.headers.cookie;
            var currentUser = _this.findUserBySession(session);
            _this.associateUserSessionAndSocket({user: currentUser, session: session, socket: socket});

            socketConnection.on(SocketIoConnection.EventTypes.DISCONNECT, _this.hearSocketDisconnect, _this);
            _this.socketUuidToSocketConnectionMap.put(socketConnection.getUuid(), socketConnection);
            _this.dispatchEvent(new Event(SocketIoManager.EventTypes.CONNECTION, {
                socket: socketConnection
            }));
        });

        callback();
    },

    /**
     * @param {} cookieParser
     * @param {} sessionStore
     * @param {} sessionKey
     */
    configure: function(cookieParser, sessionStore, sessionKey, callback) {
        this.ioManager.manager.set('authorization', function(data, callback){
            cookieParser(data, {}, function(error) {
                if(!error){
                    sessionStore.get(data.signedCookies[sessionKey], function(error, session){
                        if(!error){
                            data.session = session;
                            callback(null, true);
                        } else {
                            callback('Session error', true);
                        }
                    });
                } else {
                    callback(error, false);
                }
            });
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AlphaSocketIoManager', AlphaSocketIoManager);
