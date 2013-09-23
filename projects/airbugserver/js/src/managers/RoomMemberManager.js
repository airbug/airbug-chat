//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

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

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MongoManager}
         */
        this.dataStore              = mongoDataStore.generateManager("RoomMember");
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} roomMember
     * @param {function(Error, RoomMember} callback
     */
    createRoomMember: function(roomMember, callback) {
        this.create(roomMember, function(error, roomMember) {
            if (callback) {
                callback(error, roomMember);
            }
        });
    },

    /**
     * @param {{
     *
     * }} roomMemberData
     * @return {
     */
    generateRoomMember: function(roomMemberData) {

    },

    /**
     * @param {RoomMember} roomMember
     * @param {function(Error)} callback
     */
    removeRoomMember: function(roomMember, callback) {
        $parallel([
        ])

        console.log("Error:", error, "returnedRoomMember:", returnedRoomMember);
        roomMember = returnedRoomMember;
        if (!error && returnedRoomMember) {
            returnedRoomMember.remove(function(error){
                flow.complete(error);
            });
        } else {
            flow.complete(error);
        }
    },

    /**
     * @param {string} roomMemberId
     * @param {function(Error, RoomMember)} callback
     */
    retrieveRoomMember: function(roomMemberId, callback) {

        this.dataStore.findById(roomMemberId, function(error, returnedRoomMember){

        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, RoomMember)} callback
     */
    retrieveRoomMemberByUserIdAndRoomId: function(userId, roomId, callback) {
        this.dataStore.findOne({roomId: roomId, userId: userId}, function(error, returnedroomMember){
            console.log("Error:", error, "returnedroomMember:", returnedroomMember);
            roomMember = returnedroomMember;
            if(!error && returnedroomMember) {
                returnedroomMember.remove(function(error){
                    flow.complete(error);
                });
            } else {
                flow.complete(error);
            }
        });
    },

    /**
     * @param {RoomMember} roomMember
     * @param {function(Error, RoomMember} callback
     */
    saveRoomMember: function(roomMember, callback) {
        if (!roomMember.getCreatedAt()) {
            roomMember.setCreatedAt(new Date());
        }
        roomMember.setUpdatedAt(new Date());
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
