//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('airbug.RoomList')
//@Require('airbug.RoomModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');
var RoomList        = bugpack.require('airbug.RoomList');
var RoomModel       = bugpack.require('airbug.RoomModel');


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
     * @param {function(Throwable, Meld=)} callback
     */
    addUserToRoom: function(userId, roomId, callback) {
        var requestData = {userId: userId, roomId: roomId};
        this.request("addUserToRoom", requestData, callback);
    },

    /**
     * @param {{
     *      name: string
     * }} roomObject
     * @param {function(Throwable, Meld=)} callback
     */
    createRoom: function(roomObject, callback) {
        this.create("Room", roomObject, callback);
    },

    /**
     * @param {IList=} dataList
     * @return {RoomList}
     */
    generateRoomList: function(dataList) {
        return new RoomList(dataList);
    },

    /**
     * @param {Object=} roomObject
     * @param {MeldDocument=} roomMeldDocument
     * @returns {RoomModel}
     */
    generateRoomModel: function(roomObject, roomMeldDocument) {
        return new RoomModel(roomObject, roomMeldDocument);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, Meld=)} callback
     */
    joinRoom: function(roomId, callback) {
        var requestData = {roomId: roomId};
        this.request("joinRoom", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, string)} callback
     */
    leaveRoom: function(roomId, callback) {
        var requestData = {roomId: roomId};
        this.request("leaveRoom", requestData, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveRoom: function(roomId, callback) {
        this.retrieve("Room", roomId, callback);
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        this.retrieveEach("Room", roomIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
