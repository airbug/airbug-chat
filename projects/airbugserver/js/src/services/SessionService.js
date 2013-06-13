//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionService')

//@Require('Class')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager            = sessionManager;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} currentUser
     * @param {Room} room
     * @param {function(Error, Room)} callback
     */
    create: function(currentUser, room, callback) {
        var _this = this;
        var room = this.roomManager.create(room, function(error, room){
            if(!error){
                _this.addUserToRoom(currentUser.id, room.id, callback);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error)} callback
     */
    addUserToRoom: function(userId, roomId, callback){
        this.roomManager.addUser(roomId, user);
        // callback();
        this.notifyRoomMembers(roomId, "userAddedToRoom", {}, function(){

        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error)} callback
     */
    removeUserFromRoom: function(userId, roomId, callback){
        this.roomManager.removeUser(roomId, userId, callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {ObjectId} roomId
     * @param {string} eventName
     * @param {{*}} data
     * @param {function()} callback
     **/
    notifyRoomMembers: function(roomId, eventName, data, callback){
        var socketsMap  = this.socketsMap;
        var userManager = this.userManager;
        this.roomManager.findById(roomId, function(error, room){
            var roomMembers = room.membersList;
            //populate
            roomMembers.forEach(function(roomMember){
                var userId  = roomMember.userId;
                userManager.findById(userId, function(error, user){

                });
                sockets = socketsMap.findSocketsByUser(user);
                sockets.forEach(function(socket){
                    socket.emit(eventName, data);
                });
            });
        });

        callback();
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
