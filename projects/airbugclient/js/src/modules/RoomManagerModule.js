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
        console.log("getting all rooms");
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

    //-------------------------------------------------------------------------------
    // Class Methods
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
                callback(error, room);
            } else {
                callback(error, null);
            }
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error, room)} callback
     */
    joinRoom: function(roomId, callback) {
        var _this = this;
        this.airbugApi.joinRoom(roomId, function(error, room){
            console.log("Inside RoomManagerModule#joinRoom");
            if(!error && room){
                _this.put(room._id, room);
                callback(null, room);
            } else {
                callback(error, room);
            }
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error, roomId)} callback
     */
    leaveRoom: function(roomId, callback) {
        var _this = this;
        this.airbugApi.leaveRoom(roomId, function(error, roomId){
            console.log("Inside RoomManagerModule#leaveRoom");
            if(!error){
                console.log("removing room from cache");
                _this.remove(roomId);
                callback(null, roomId);
            } else {
                callback(error, roomId);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
