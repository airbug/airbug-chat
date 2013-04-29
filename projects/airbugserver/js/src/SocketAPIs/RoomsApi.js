//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomsApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------



//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomsApi = {

    create: function(){

    }

    update: function(){
        
    },

    /*
     * @private
     * @param {ObjectId} roomId
     * @param {string} eventName
     * @param {{*}} data
     * @param {function()} callback
     **/
    notifyRoomMembers: function(roomId, eventName, data, callback){
        var room = Rooms.findById();
        var roomMembers = room.membersList;
        roomMembers.forEach(function(roomMember){
            var userId = roomMember.userId;
            sockets = socketsMap.findSocketsByUserId(userId);
            sockets.forEach(function(socket){
                socket.emit(eventName, data);
            });
        });

        callback();
    }

}


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomsApi', RoomsApi);
