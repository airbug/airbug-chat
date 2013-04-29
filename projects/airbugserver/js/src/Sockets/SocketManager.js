//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


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
var SessionToSocketsMap = bugpack.require('airbugserver.SessionToSocketsMap');

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
         * @type {http.Server}
         **/
        this.server                 = null;

        /*
         * @type {}
         **/
        this.socketIoManager        = null;

        /*
         * @type {Map}
         **/
        this.sessionToSocketsMap    = null;

        /*
         * @type {Map}
         **/
        this.sessionToUserMap       = null;
    },

    initialize: function(server){
        this.server                 = server;
        this.socketIoManager        = io.listen(server);
        this.sessionToSocketsMap    = new SessionToSocketsMap();
        this.sessionToUserMap       = new Map();

        return this;
    },

    enableSockets: function(cookieParser, sessionStore, sessionKey){
        var server = this.server;
        var socketIoManager = this.socketIoManager;
        var sessionToUserMap = this.sessionToUserMap;
        var sessionToSocketsMap = this.sessionToSocketsMap;
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
            sessionToSocketsMap.addSocketToSession(session, socket);


            // SocketRoutes.globalRoutes.enable(socket);

            socket.on('establishUser', function(data){
                var userObj = {email: data.email, name: data.name};
                var callback = function(error, currentUser){
                    if(!error){
                        currentUser = currentUser;
                        SocketManager.addEstablishedUserListeners(socket);
                    } else {
                        console.log(error);
                    }
                };

                UsersApi.establishUser(userObj, callback);
            });
        });
    },

    addEstablishedUserListeners: function(socket){
        // SocketRoutes.establishedUserRoutes.enable(socket);
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
