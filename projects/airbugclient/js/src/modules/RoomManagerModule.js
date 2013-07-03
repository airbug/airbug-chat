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

    leaveRoom: function(roomId, callback) {
        //TODO
        var _this = this;
        this.airbugApi.leaveRoom(roomId, function(error, room){
            console.log("Inside RoomManagerModule#leaveRoom");
            if(!error && room){
                console.log("removing room from cache");
                _this.remove(room._id);
                callback(null);
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
