//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomManagerModule')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.CurrentUserModel')
//@Require('airbug.RoomModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var CurrentUserModel    = bugpack.require('airbug.CurrentUserModel');
var SessionModel        = bugpack.require('airbug.RoomModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi  = airbugApi;

        /**
         * @private
         * @type {UserModel}
         */
        this.roomModel  = new RoomModel({});

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {{
     *      name: string
     * }} room
     * @param {function(error, room)} callback
     */
    createRoom: function(room, callback) {
        var roomName = room.name;
        this.airbugApi.createRoom(roomName, function(error, room){
            callback(error, room);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
