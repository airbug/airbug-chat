//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('airbugserver.Room')
//@Require('bugentity.EntityManager')
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
var Set                         = bugpack.require('Set');
var Room                        = bugpack.require('airbugserver.Room');
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

var RoomManager = Class.extend(EntityManager, {


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Room} room
     * @param {function(Throwable, Room)} callback
     */
    createRoom: function(room, callback) {
        this.create(room, callback);
    },

    /**
     * @param {Room} room
     * @param {function(Throwable)} callback
     */
    deleteRoom: function(room, callback) {
        this.delete(room, callback);
    },

    /**
     * @param {{
     *      conversationId: string,
     *      createdAt: Date,
     *      id: string,
     *      name: string,
     *      updatedAt: Date,
     *      roomMemberIdSet: (Array.<string> | Set.<string>)
     * }} data
     * @return {Room} //entity
     */
    generateRoom: function(data) {
        data.roomMemberIdSet = new Set(data.roomMemberIdSet);
        return new Room(data);
    },

    /**
     * @param {Room} room
     * @param {Array.<string>} properties
     * @param {function(Throwable, Room)} callback
     */
    populateRoom: function(room, properties, callback) {
        var options = {
            roomMemberSet: {
                idGetter:   room.getRoomMemberIdSet,
                getter:     room.getRoomMemberSet,
                setter:     room.setRoomMemberSet
            },
            conversation: {
                idGetter:   room.getConversationId,
                getter:     room.getConversation,
                setter:     room.setConversation
            }
        };
        this.populate(room, options, properties, callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Throwable, Room)} callback
     */
    retrieveRoom: function(roomId, callback) {
        this.retrieve(roomId, callback);
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Throwable, Map.<string, Room>)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        this.retrieveEach(roomIds, callback);
    },

    /**
     * @param {Room} room
     * @param {function(Throwable, Room)} callback
     */
    updateRoom: function(room, callback) {
        this.update(room, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomManager).with(
    entityManager("roomManager")
        .ofType("Room")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
