//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomService')

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

var RoomService = Class.extend(Obj, {

    _constructor: function(roomManager, socketIoManager, socketsMap, userManager){

        this._super();

        this.roomManager            = roomManager;

        this.socketIoManager        = socketIoManager;

        this.socketsMap             = socketsMap;

        this.userManager            = userManager;

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {Room} room
     **/
    create: function(currentUser, room, callback){
        var _this = this;
        var room = this.roomManager.create(room, function(error, room){
            if(!error){
                _this.addUserToRoom(currentUser.id, room.id, callback);
            } else {
                callback(error);
            }
        });
    },

    addUserToRoom: function(userId, roomId, callback){
        this.roomManager.addUser(roomId, user);
        // callback();
        this.notifyRoomMembers(roomId, "userAddedToRoom", {}, function(){
            
        });
    },

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
