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
    create: function(currentUser, room){
        var _this = this;
        var room = this.roomManager.create(room, function(error, room){
            if(!error && room){
                _this.addUserToRoom(currentUser, room.id);
            }
        });
    },

    addUserToRoom: function(user, roomId){
        this.roomManager.addUser(roomId, user);
        this.notifyRoomMembers(roomId, "userAddedToRoom", {}, function(){
            
        });
    },

    removeUserFromRoom: function(user, roomId){
        
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
        var room        = this.roomManager.findById(roomId);
        var roomMembers = room.membersList;
        var userManager = this.userManager;

        roomMembers.forEach(function(roomMember){
            var userId  = roomMember.userId;
            var user    = userManager.findById(userId);
            sockets = socketsMap.findSocketsByUser(user);
            sockets.forEach(function(socket){
                socket.emit(eventName, data);
            });
        });

        callback();
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
