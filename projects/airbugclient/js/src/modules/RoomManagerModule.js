//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, meldObjectManagerModule) {

        this._super(airbugApi, meldObjectManagerModule);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(error, meldbug.MeldObj)} callback
     */
    addUserToRoom: function(userId, roomId, callback){
        var requestData = {userId: userId, roomId: roomId};
        this.request("addUserTo", "Room", requestData, callback);
    },

    /**
     * @param {{
     *      name: string
     * }} room
     * @param {function(error, meldbug.MeldObj)} callback
     */
    createRoom: function(roomObj, callback) {
        this.create("Room", roomObj, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(error, meldbug.MeldObj)} callback
     */
    joinRoom: function(roomId, callback) {
        var requestData = {objectId: roomId};
        this.request("join", "Room", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(error, string)} callback //roomId
     */
    leaveRoom: function(roomId, callback) {
        var requestData = {objectId: roomId};
        this.request("leave", "Room", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(error, meldbug.MeldObj)} callback
     */
    retrieveRoom: function(roomId, callback) {
        this.retrieve("Room", roomId, callback);
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(error, Array.<meldbug.MeldObj>)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        this.retrieveEach("Room", roomIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
