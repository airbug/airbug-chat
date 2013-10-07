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

var bugpack         = require('bugpack').context();


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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    addUserToRoom: function(userId, roomId, callback) {
        var requestData = {userId: userId, roomId: roomId};
        this.request("addUserTo", "Room", requestData, callback);
    },

    /**
     * @param {{
     *      name: string
     * }} roomObject
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    createRoom: function(roomObject, callback) {
        this.create("Room", roomObject, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    joinRoom: function(roomId, callback) {
        var requestData = {objectId: roomId};
        this.request("join", "Room", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, string)} callback
     */
    leaveRoom: function(roomId, callback) {
        var requestData = {objectId: roomId};
        this.request("leave", "Room", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    retrieveRoom: function(roomId, callback) {
        this.retrieve("Room", roomId, callback);
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Throwable, Array.<meldbug.MeldDocument>)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        this.retrieveEach("Room", roomIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
