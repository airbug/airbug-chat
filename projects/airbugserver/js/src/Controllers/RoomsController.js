//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomsController')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var BugFlow                 = bugpack.require('bugflow.BugFlow');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomsController = Class.extend(Obj, {

    _constructor: function(socketRoutesManager, socketIoManager, roomService){

        this._super();

        /**
         * @type {RoomService}
         */
        this.roomService            = roomService;

        /**
         * @type {SocketRoutesManager}
         */
        this.socketRoutesManager    = socketRoutesManager; 

        /**
         * @type {SocketIoManager}
         */
        this.socketIoManager        = socketIoManager; //Necessary???

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        var socketRoutesManager = this.socketRoutesManager;
        this.socketRoutesManager.addAll([

            new SocketRoute("addUserToRoom", function(socket, data){
                var currentUser = socket.getUser();
                if(currentUser){

                }
            }),
            new SocketRoute("createRoom", function(socket, data){
                var currentUser = socket.getUser();
                var room;
                if(currentUser){
                    _this.roomService.create(currentUser, room, callback);
                }
            }),
            new SocketRoute("joinRoom", function(socket, data){
                if(currentUser){
                    var userId = currentUser.id;
                    var roomId = params.roomId || params.room.id;
                    _this.roomService.addUserToRoom(currentUser.id, roomId);
                }
            }),
            new SocketRoute("leaveRoom", function(socket, data){
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

bugpack.export('airbugserver.RoomsController', RoomsController);
