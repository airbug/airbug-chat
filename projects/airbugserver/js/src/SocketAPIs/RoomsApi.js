//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomsApi')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Room')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var Room        = bugpack.require('airbugserver.Room');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomsApi = Class.extend(Obj, {

    _constructor: function(){

        this._super();


        //-------------------------------------------------------------------------------
        // Dependencies
        //-------------------------------------------------------------------------------

        /**
         * @type {SocketsMap}
         */
        this.socketsMap = null;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {Room} room
     **/
    create: function(room){
        var room = Room.create(room);
    },

    addUserToRoom: function(){
        
    },

    /*
     * @private
     * @param {ObjectId} roomId
     * @param {string} eventName
     * @param {{*}} data
     * @param {function()} callback
     **/
    notifyRoomMembers: function(roomId, eventName, data, callback){
        var room = Room.findById();
        var roomMembers = room.membersList;
        roomMembers.forEach(function(roomMember){
            var userId = roomMember.userId; //BUGBUG
            sockets = socketsMap.findSocketsByUser(user); //BUGBUG
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

bugpack.export('airbugserver.RoomsApi', RoomsApi);
