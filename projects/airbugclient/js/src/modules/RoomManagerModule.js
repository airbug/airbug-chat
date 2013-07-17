//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomManagerModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


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
         * @type {Map}
         */
        this.roomsMap   = new Map();

    },

    clearCache: function(){
        this.roomsMap.clear();
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} id
     * @return {roomObj}
     */
    get: function(id){
        return this.roomsMap.get(id);
    },

    getAll: function(){
        return this.roomsMap.getValueArray();
    },

    /**
     * @param {string} id
     * @return {roomObj}
     */
    put: function(id, room){
        this.roomsMap.put(id, room);
    },

    /**
     * @param {string} id
     * @return {roomObj}
     */
    remove: function(id){
        this.roomsMap.remove(id);
    },

    updateRooms: function(roomIds, callback){
        roomIds.forEach(function(roomId){
            var room = _this.get(roomId);
            if(!room) {
                _this.retrieveRoom(roomId, function(error, room){

                });
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Class Instance Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {{
     *      name: string
     * }} room
     * @param {function(error, room)} callback
     */
    createRoom: function(roomObj, callback) {
        var _this = this;
        this.airbugApi.createRoom(roomObj, function(error, room){
            if(!error && room){
                _this.put(room._id, room);
            }
            callback(error, room);
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error, room)} callback
     */
    joinRoom: function(roomId, callback) {
        var _this = this;
        this.airbugApi.joinRoom(roomId, function(error, room){
            if(!error && room){
                _this.put(room._id, room);
            }
            callback(error, room);
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error, roomId)} callback
     */
    leaveRoom: function(roomId, callback) {
        var _this = this;
        this.airbugApi.leaveRoom(roomId, function(error, roomId){
            if(!error){
                _this.remove(roomId);
            }
            callback(error, roomId);
        });
    },

    retrieveRoom: function(roomId, callback) {
        var _this = this;
        this.airbugApi.retrieveRooms(roomId, function(error, room){
            if(!error && room){
                _this.put(room._id, room);
                callback(error, room);
            }
        });
    },

    retrieveRooms: function(roomIds, callback) {
        var _this = this;
        this.airbugApi.retrieveRooms(roomIds, function(error, rooms){
            if(!error && rooms){
                rooms.forEach(function(room){
                    _this.put(room._id, room);
                });
                callback(error, rooms);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
