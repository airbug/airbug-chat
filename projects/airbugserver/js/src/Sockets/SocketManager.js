//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketManager')

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

var SocketManager = Class.extend(Obj, {
    
    _constructor: function(){

        this._super();

        /*
         * @type {ExpressServer}
         **/
        this.expressServer                 = null;

        /*
         * @type {}
         **/
        this.socketIoManager        = null;

        /*
         * @type {SocketsMap}
         **/
        this.socketsMap             = null;

    },

    initialize: function(){
        var server              = this.expressServer.getHttpServer();
        this.socketIoManager    = io.listen(server);
        this.socketsMap         = new SocketsMap();

        return this;
    },

    enableSockets: function(cookieParser, sessionStore, sessionKey){
        var server = this.server;
        var socketIoManager = this.socketIoManager;
        var sessionToUserMap = this.sessionToUserMap;
        var sessionToSocketsMap = this.socketsMap;
        var alphaSocketManager = socketIoManager.of('/alpha');

        alphaSocketManager.set('authorization', function(data, callback){
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

        alphaSocketManager.sockets.on('connection', function(socket){
            console.log("Connection established")
            console.log("session:", socket.handshake.session);
            var session = socket.handshake.session;
            // var cookie = socket.handshake.headers.cookie;
            var currentUser = sessionToUserMap.get(session);
            SocketsMap.associateSocketWithSession({session: session, socket: socket});

            GlobalSocketRoutes.enableAll(null, socket);

        });
    },

    addEstablishedUserListeners: function(socket){
        EstablishedUserRoutes.enableAll(null, socket);
    }
});


// createRoom: function(){
//     
// },
// 
// joinRoom:function(){
//     
// },
// 
// notifyRoom: function(roomId, eventObj){
//     var room = Rooms.get(roomId);
//     var sessions = room.sessions;
//     sessions.forEach(function(session){
//         var socket = SessionToSocketMap.get(session);
//         socket.emit(eventObj.name, eventObj.data);
//     })
// },
// 
// notifyUser: function(userId, eventObj){
//     var user = Users.get(userId);
//     
// },

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketManager', SocketManager);
