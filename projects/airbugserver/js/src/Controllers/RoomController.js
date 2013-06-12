//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')

//@Require('Class')
//@Require('Obj')
//@Require('bugroutes.SocketRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var SocketRoute = bugpack.require('bugroutes.SocketRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketRouter, roomService){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomService}
         */
        this.roomService            = roomService;

        /**
         * @private
         * @type {SocketRouter}
         */
        this.socketRouter    = socketRouter;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback) {
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        this.socketRouter.addAll([

            new SocketRoute("addUserToRoom", function(connection, data){
                var currentUser = connection.getUser();
                if(currentUser){

                }
            }),
            new SocketRoute("createRoom", function(connection, data){
                var currentUser = connection.getUser();
                var room;
                if(currentUser){
                    _this.roomService.create(currentUser, room, callback);
                }
            }),
            new SocketRoute("joinRoom", function(connection, data){
                if(currentUser){
                    var userId = currentUser.id;
                    var roomId = params.roomId || params.room.id;
                    _this.roomService.addUserToRoom(currentUser.id, roomId);
                }
            }),
            new SocketRoute("leaveRoom", function(connection, data){
                if(currentUser){
                    _this.roomService.removeUserFromRoom(currentUser, roomId);
                }
            })
        ]);

        callback();

    },
     
     //-------------------------------------------------------------------------------
     // Private Methods
     //-------------------------------------------------------------------------------

     pre: function(params, callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        if(currentUser){
            callback();
        } else {

        }
     }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
