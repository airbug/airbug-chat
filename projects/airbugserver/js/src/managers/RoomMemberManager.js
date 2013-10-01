//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('airbugserver.RoomMember')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var RoomMember  = bugpack.require('airbugserver.RoomMember');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {
        this._super("RoomMember", mongoDataStore);
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} roomMember
     * @param {function(Error, RoomMember} callback
     */
    createRoomMember: function(roomMember, callback) {
        this.create(roomMember, callback);
    },

    /**
     *
     */
    deleteRoomMember: function(roomMember, callback){
        //TODO
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      memberType: string,
     *      roomId: string,
     *      updatedAt: Date,
     *      userId: string
     * }} data
     * @return {
     */
    generateRoomMember: function(data) {
        return new RoomMember(data)
    },

    populateRoomMember: function(roomMember, properties, callback){
        var options = {
            propertyNames:  ["room", "user"],
            entityTypes:    ["Room", "User"]
        };
        this.populate(options, roomMember, properties, callback);
    },

    /**
     * @param {RoomMember} roomMember
     * @param {function(Error)} callback
     */
    removeRoomMember: function(roomMember, callback) {
        //TODO replace with deleteRoomMember
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
        this.retrieve(roomMemberId, callback);
    },

    /**
     * @param {Array.<string>} roomMemberIds
     * @param {function(Throwable, Map.<string, RoomMember>)} callback
     */
    retrieveRoomMembers: function(roomMemberIds, callback){
        this.retrieveEach(roomMemberIds, callback);
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
        //TODO
        if (!roomMember.getCreatedAt()) {
            roomMember.setCreatedAt(new Date());
        }
        roomMember.setUpdatedAt(new Date());
    },

    updateRoomMember: function(){
        //TODO
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
