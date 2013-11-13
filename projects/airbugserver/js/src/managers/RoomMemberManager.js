//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')
//@Autoload

//@Require('Class')
//@Require('airbugserver.RoomMember')
//@Require('bugentity.EntityManger')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var RoomMember                  = bugpack.require('airbugserver.RoomMember');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
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
    deleteRoomMember: function(roomMember, callback) {
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

    populateRoomMember: function(roomMember, properties, callback) {
        var options = {
            room: {
                idGetter:   roomMember.getRoomId,
                getter:     roomMember.getRoom,
                setter:     roomMember.setRoom
            },
            user: {
                idGetter:   roomMember.getUserId,
                getter:     roomMember.getUser,
                setter:     roomMember.setUser
            }
        };
        this.populate(roomMember, options, properties, callback);
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
    retrieveRoomMembers: function(roomMemberIds, callback) {
        this.retrieveEach(roomMemberIds, callback);
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, RoomMember)} callback
     */
    retrieveRoomMemberByUserIdAndRoomId: function(userId, roomId, callback) {
        var _this = this;
        this.dataStore.findOne({roomId: roomId, userId: userId}).lean(true).exec(function(throwable, dbJson) {
            if (!throwable) {
                var entityObject = null;
                if (dbJson) {
                    entityObject = _this["generate" + _this.entityType](dbJson);
                    entityObject.commitDelta();
                }
                callback(undefined, entityObject);
            } else {
                callback(throwable);
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
    updateRoomMember: function(roomMember, callback) {
        this.update(roomMember, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberManager).with(
    entityManager("roomMemberManager")
        .ofType("RoomMember")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
