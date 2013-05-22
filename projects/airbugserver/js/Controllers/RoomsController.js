//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomsApi')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.ApplicationController')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ApplicationController   = bugpack.require('airbugserver.ApplicationController');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomsController = Class.extend(ApplicationController, {

    _constructor: function(){

        this._super();

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {Room} room
     **/
    create: function(currentUser, room){
        var room = this.roomApi.create(room);
        this.addUserToRoom(currentUser, room.id);
    },

    addUserToRoom: function(user, roomId){
        this.roomApi.addUser(roomId, user);
        this.notifyRoomMembers(roomId, "userAddedToRoom", {}, function(){
            
        });
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
        var room        = this.roomApi.findById(roomId);
        var roomMembers = room.membersList;
        var userApi     = this.userApi;

        roomMembers.forEach(function(roomMember){
            var userId  = roomMember.userId;
            var user    = userApi.findById(userId);
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

bugpack.export('airbugserver.RoomsController', RoomsController);
