//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionToSocketsMap')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var Set         = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// UserSessionsSockets
var SocketsMap = Class.extend(Obj, {
    
    _constructor: function(){

        this._super();

        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        this.userToSessionsMap = null;

        this.sessionToUserMap = null;

        this.sessionToSocketsMap = null;
    },

    initialize: function(){

        this.userToSessionsMap = new Map();

        this.sessionToSocketsMap = new Map();

        this.sessionToUserMap = new Map();

    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {{
     *      sessionId: number, //string???
     *      socket: Socket
     * }} params
     **/
    associateSocketWithSession: function(params){
        var sessionId = params.sessionId;
        var socket = params.socket;
        if(!this.sessionToSocketsMap.get(sessionId)){
            var sockets = new Set();
            sockets.add(socket);
            this.sessionToSocketsMap.put(sessionId, sockets);
        } else {
            var socketsSet = this.sessionToSocketsMap.get(sessionId);
            socketsSet.add(socket);
            this.sessionToSocketsMap.put(sessionId, sockets);
        }
    },

    /*
     * @param {{
     *      userId: mongoose.Schema.Types.ObjectId
     *      sessionId: number, //??
     * }} params
     **/
    associateUserWithSession: function(params){
        this.addUserToSessions(params);
        this.addSessionToUser(params);
    },

    findUserBySessionId: function(sessionId){
        return this.sessionToUserMap.get(sessionId);
    },

    findSocketsBySessionId: function(sessionId){
        return this.sessionToSocketsMap.get(sessionId);
    },

    findSocketsByUserId: function(userId){
        var _this = this;
        var sockets = [];
        var sessions = this.userToSessionsMap.get(userId);
        sessions.forEach(function(session, index, array){
            sockets = sockets.concat(_this.sessionToSocketsMap.get(session.id));
        })
        return sockets;
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------
    /*
     * @private
     * @param {{
     *      userId: mongoose.Schema.Types.ObjectId
     *      sessionId: number, //??
     * }} params
     **/
    addUserToSessions: function(params){ // a user can have more than one session if they login on different computers
        var userId      = params.userId;
        var sessionId   = params.sessionId;
        if(!this.userToSessionsMap.get(userId)){
            var sessions = new Set();
            sessions.add(sessionId);
            this.userToSessionsMap.put(userId, sessions);
        } else {
            var sessions = this.userToSessionsMap.get(userId);
            sessions.add(sessionId);
            this.userToSessionsMap.put(userId, sessions);
        }
    },

    /*
     * @private
     * @param {{
     *      userId: mongoose.Schema.Types.ObjectId
     *      sessionId: number, //??
     * }} params
     **/
    addSessionToUser: function(params){ //a session has only one user
        var userId      = params.userId;
        var sessionId   = params.sessionId;
        if(this.sessionToUserMap.get(sessionId) !== userId){
            this.sessionToUserMap.put(sessionId, userId);
        }
    }

    // , mapFromThisToThat: function(fromThis, toThat, params){
    //     var map = this.[fromThis + toThat + "Map"];
    //     
    //     
    //     var userId      = params.userId;
    //     var sessionId   = params.sessionId;
    //     if(!this.userToSessionsMap.get(userId)){
    //         var sessions = new Set();
    //         sessions.add(sessionId);
    //         this.userToSessionsMap.put(userId, sessions);
    //     } else {
    //         var sessions = this.userToSessionsMap.get(userId);
    //         sessions.add(sessionId);
    //         this.userToSessionsMap.put(userId, sessions);
    //     }
    // }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketsMap', SocketsMap);
