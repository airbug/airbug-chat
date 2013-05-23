//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomsController')

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

var RoomsController = Class.extend(Obj, {

    _constructor: function(roomService){

        this._super();

        this.roomService = roomService;

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    // configure: function(){
    //     
    // },


    /*
     * @param {} params
     **/
     createRoom: function(params){
         if(currentUser){
             this.roomService.create(params)
         }
     },

     /*
      * @param {} params
      **/
     joinRoom: function(params){
         if(currentUser){
             var roomId = params.roomId || params.room.id;
             this.roomService.addUserToRoom(currentUser, roomId);
         }
     },

     /*
      * @param {} params
      **/
     leaveRoom: function(params){
         if(currentUser){
             var roomId = params.roomId || params.room.id;
             this.roomService.removeUserFromRoom(currentUser, roomId);
         }
     },
     
     //-------------------------------------------------------------------------------
     // Private Methods
     //-------------------------------------------------------------------------------

     pre: function(){

     }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomsController', RoomsController);
