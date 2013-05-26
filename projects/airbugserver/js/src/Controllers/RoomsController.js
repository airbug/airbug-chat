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

    _constructor: function(socketIoManager, roomService){

        this._super();

        this.roomService        = roomService;

        this.socketIoManager    = socketIoManager;

        this.ioManager          = null;

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        var _this       = this;
        var callback    = callback || function(){};
        var ioManager   = this.socketIoManager.getIoManager();
        this.socketRoutesManager = new RoutesManager(ioManager);
        this.socketRoutesManager.addAll([
            new SocketRoute("addUserToRoom", function(params){
                
            }),
            new SocketRoute("createRoom", function(params){
                var room;
                if(currentUser){
                    _this.roomService.create(room)
                }
            }),
            new SocketRoute("joinRoom", function(params){
                if(currentUser){
                    var roomId = params.roomId || params.room.id;
                    _this.roomService.addUserToRoom(currentUser, roomId);
                }
            }),
            new SocketRoute("leaveRoom", function(params){
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
