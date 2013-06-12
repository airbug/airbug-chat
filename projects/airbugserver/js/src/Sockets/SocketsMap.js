//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketsMap')

//@Require('Class')
//@Require('List')
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
var List        = bugpack.require('List');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


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

        this.sessionToSocketsMap    = new Map(); // session => sockets // has many

        this.sessionToUserMap       = new Map(); // session => user // has one

        this.userToSessionsMap      = new Map(); // user => sessions // has many

        this.socketToUserMap        = new Map(); // socket => user // has one

    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {{
     *      session: {*},
     *      socket: {Socket},
     *      user: {mongoose.model.User}
     * }} params
     **/
    associateUserSessionAndSocket: function(params){
        this.associateSocketWithSession(params);
        this.associateUserWithSession(params);
        this.associateUserWithSocket(params);
    },

    /*
     * @param {{
     *      session: {*},
     *      socket: {*}
     * }} params
     **/
    associateSocketWithSession: function(params){
        var session     = params.session;
        var socket      = params.socket;
        if(session && socket){
            if(!this.findSocketsBySession(session)){
                var sockets = [socket];
                this.sessionToSocketsMap.put(session, sockets);
            } else {
                var socketsSet = this.sessionToSocketsMap.get(session);
                socketsSet.push(socket);
                this.sessionToSocketsMap.put(session, sockets);
            }
        }
    },

    /*
     * @param {{
     *      user: mongoose.model.User,
     *      session: {*}
     * }} params
     **/
    associateUserWithSession: function(params){
        this.addUserToSessions(params);
        this.addSessionToUser(params);
    },

    associateUserWithSocket: function(params){
        this.addUserToSocket(params);
    },

    /*
     * @param {{*}} (Session object)
     * @return {User}
     **/
    findUserBySession: function(session){
        return this.sessionToUserMap.get(session);
    },

    /*
     * @param {mongoose.model.User}
     * @return {Array.<session>}
     **/
    findSessionsByUser: function(user){
        return this.userToSessionsMap.get(user);
    },

    /*
     * @param {{*}} (Session object)
     * @return {Array.<socket>}
     **/
    findSocketsBySession: function(session){
        return this.sessionToSocketsMap.get(session);
    },

    /*
     * @return {Array.<socket>}
     **/
    findSocketsByUser: function(user){
        var _this = this;
        var sockets = [];
        var sessions = this.userToSessionsMap.get(user);
        sessions.forEach(function(session, index, array){
            var otherSockets = _this.findSocketsBySession(session);
            if(otherSockets){
                sockets = sockets.concat(otherSockets);
            }
        })
        return sockets;
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {{
     *      user: {mongoose.model.User},
     *      session: {*}
     * }} params
     **/
    addUserToSessions: function(params){ // a user can have more than one session if they login on different computers
        var user      = params.user;
        var session   = params.session;
        if(user && session){
            if(!this.userToSessionsMap.get(user)){
                var sessions = [session];
                this.userToSessionsMap.put(user, sessions);
            } else {
                var sessions = this.userToSessionsMap.get(user);
                sessions.push(session);
                this.userToSessionsMap.put(user, sessions);
            }
        }
    },

    /*
     * @private
     * @param {{
     *      user: {mongoose.model.User},
     *      socket: {*}
     * }} params
     **/
    addUserToSocket: function(params){
        var user = params.user;
        var socket = params.socket;
        if(user && socket){
            socket.setUser(user);
            if(!this.socketToUserMap.get(socket)){
                this.socketToUserMap.put(socket, user);
            }
        }
    },

    /*
     * @private
     * @param {{
     *      user: {mongoose.model.User},
     *      session: {*}
     * }} params
     **/
    addSessionToUser: function(params){ //a session has only one user
        var user      = params.user;
        var session   = params.session;
        if(user && session){
            if(!this.sessionToUserMap.get(session)){
                this.sessionToUserMap.put(session, user);
            }
        }
    }

    //   /**
    //    * @param {string} fromThis
    //    * @param {string} toThat
    //    * @param {*} params
    //    */
    // , mapFromThisToThat: function(fromThis, toThat, params){
    //     var map = this.[fromThis + "To" + toThat.capitalize() + "Map"];
    //     
    //     if(!map.get(params[fromThis])){
    //         arr = [];
    //         arr.add(params[toThat]);
    //         map.put(params[fromThis], arr);
    //     } else {
    //         var arr = map.get(params[fromThis]);
    //         arr.add(params[toThat]);
    //         map.put(params[fromThis], arr);
    //     }
    // }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketsMap', SocketsMap);
