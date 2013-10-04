//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')

//@Require('Class')
//@Require('Map')
//@Require('Set')
//@Require('airbugserver.EntityManager')
//@Require('airbugserver.Room')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Set                 = bugpack.require('Set');
var EntityManager       = bugpack.require('airbugserver.EntityManager');
var Room                = bugpack.require('airbugserver.Room');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomManager = Class.extend(EntityManager, {

    /**
     * @constructs
     * @param {MongoDataStore} mongoDataStore
     * @param {ConversationManager} conversationManager
     * @param {RoomMemberManager} roomMemberManager
     */
    _constructor: function(mongoDataStore, conversationManager, roomMemberManager) {

        this._super("Room", mongoDataStore);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @private
         * @type {RoomMemberManager}
         */
        this.roomMemberManager      = roomMemberManager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Room} room //entity
     * @param {function(Throwable, Room)} callback
     */
    createRoom: function(room, callback) {
        this.create(room, callback);
    },

    /**
     * @param {Room} room
     * @param {function(Throwable)} callback
     */
    deleteRoom: function(room, callback){
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
            propertyNames: ["conversation", "roomMemberSet"],
            propertyKeys: {
                roomMemberSet: {
                    type:       "Set",
                    idGetter:   room.getRoomMemberIdSet,
                    idSetter:   room.setRoomMemberIdSet,
                    getter:     room.getRoomMemberSet,
                    setter:     room.setRoomMemberSet,
                    manager:    _this.roomMemberManager,
                    retriever:  _this.roomMemberManager.retrieveRoomMember
                },
                conversation: {
                    idGetter:   room.getConversationId,
                    idSetter:   room.setConversationId,
                    getter:     room.getConversation,
                    setter:     room.setConversation,
                    manager:    _this.conversationManager,
                    retriever:  _this.conversationManager.retrieveConversation
                }
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
