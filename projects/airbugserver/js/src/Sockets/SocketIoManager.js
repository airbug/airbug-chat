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

var SocketIoManager = Class.extend(Obj, {
    
    _constructor: function(){

        this._super();

        /*
         * @type {ExpressServer}
         **/
        this.expressServer          = null;

        /*
         * @type {}
         **/
        this.socketIoManager        = null;

        /*
         * @type {SocketsMap}
         **/
        this.socketsMap             = null;

    },

    initialize: function(callback){
        var callback            = callback || function(){};
        var server              = this.expressServer.getHttpServer();
        this.socketIoManager    = io.listen(server);

        callback();
        return this;
    },

    enableSockets: function(cookieParser, sessionStore, sessionKey, callback){
        var callback            = callback || function(){};
        var socketIoManager     = this.socketIoManager;
        var sessionToUserMap    = this.sessionToUserMap;
        var socketsMap          = this.socketsMap;
        var alphaSocketManager  = socketIoManager.of('/alpha');

        socketIoManager.set('transports', [
            'websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling'
        ]);
        socketIoManager.set('match origin protocol', true); //NOTE: Only necessary for use with wss, WebSocket Secure protocol
        socketIoManager.set('resource', '/socket-api'); //NOTE: forward slash is required here unlike client setting

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
