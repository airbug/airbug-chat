//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

//@Require('Class')
//@Require('Map')
//@Require('airbugserver.RoomMember')
//@Require('bugentity.EntityManger')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Map                         = bugpack.require('Map');
var RoomMember                  = bugpack.require('airbugserver.RoomMember');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManager = Class.extend(EntityManager, {

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
     * @param {RoomMember} roomMember
     * @param {function(Throwable)} callback
     */
    deleteRoomMember: function(roomMember, callback){
        this.delete(roomMember, callback);
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
            propertyNames: ["room", "user"],
            propertyKeys: {
                room: {
                    idGetter:   roomMember.getRoomId,
                    idSetter:   roomMember.setRoomId,
                    getter:     roomMember.getRoom,
                    setter:     roomMember.setRoom
                },
                user: {
                    idGetter:   roomMember.getUserId,
                    idSetter:   roomMember.setUserId,
                    getter:     roomMember.getUser,
                    setter:     roomMember.setUser
                }
            }
        };
        this.populate(roomMember, options, properties, callback);
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

    /**
     * @param {RoomMember} roomMember 
     * @param {function(Throwable, RoomMember)} callback
     */
    updateRoomMember: function(roomMember, callback){
        this.update(roomMember, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberManager).with(
    entityManager("RoomMember")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
