//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketIoManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


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
var SocketsMap          = bugpack.require('airbugserver.SocketsMap');

var ChatMessagesApi     = bugpack.require('airbugserver.ChatMessagesApi');
var ConversationsApi    = bugpack.require('airbugserver.ConversationsApi');
var RoomsApi            = bugpack.require('airbugserver.RoomsApi');
var UsersApi            = bugpack.require('airbugserver.UsersApi');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AlphaSocketsIoManager = Class.extend(SocketsIoManager, {

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
    },

    enableSockets: function(cookieParser, sessionStore, sessionKey, callback){
        var callback            = callback || function(){};
        var socketsMap          = this.socketsMap;
        var alphaSocketManager  = this.ioManager;

        alphaSocketManager.manager.set('authorization', function(data, callback){
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

        alphaSocketManager.on('connection', function(socket){
            console.log("Connection established")
            console.log("session:", socket.handshake.session);
            var session = socket.handshake.session;
            // var cookie = socket.handshake.headers.cookie;
            var currentUser = sessionToUserMap.get(session);
            SocketsMap.associateSocketWithSession({session: session, socket: socket});

            GlobalSocketRoutes.enableAll(null, socket);

        });
        
        console.log("socketIoManager:", socketIoManager);
        console.log("alphaSocketManager:", alphaSocketManager);
    },

    addEstablishedUserListeners: function(socket){
        EstablishedUserRoutes.enableAll(null, socket);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketIoManager', SocketIoManager);
