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
//@Require('bugflow.BugFlow')


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
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;
var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


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
     *
     */
    deleteRoom: function(room, callback){
        //TODO
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
        var _this = this;
        $forEachParallel(properties, function(flow, property) {
            switch (property) {
                case "conversation":
                    var conversationId = room.getConversationId();
                    if (conversationId) {
                        if (!room.getConversation() || room.getConversation().getId() !== conversationId) {
                            _this.conversationManager.retrieveConversation(conversationId, function(throwable, retrievedConversation) {
                                if (!throwable) {
                                    room.setConversation(retrievedConversation);
                                }
                                flow.complete(throwable);
                            })
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.complete();
                    }
                    break;
                case "roomMemberSet":
                    var roomMemberIdSet = room.getRoomMemberIdSet();
                    var roomMemberSet = room.getRoomMemberSet();
                    var lookupRoomMemberIdSet = roomMemberIdSet.clone();

                    // NOTE BRN: If the roomMember's id does not exist in the roomMemberIdSet, it means it's been removed
                    // If the roomMember's id is contained in the

                    roomMemberSet.clone().forEach(function(roomMember) {
                        if (roomMemberIdSet.contains(roomMember.getId())) {
                            lookupRoomMemberIdSet.remove(roomMember.getId());
                        } else {
                            room.removeRoomMember(roomMember);
                        }
                    });

                    $iterableParallel(lookupRoomMemberIdSet, function(flow, roomMemberId) {
                        _this.roomMemberManager.retrieveRoomMember(roomMemberId, function(throwable, roomMember) {
                            if (!throwable) {
                                room.addRoomMember(roomMember);
                            }
                            flow.complete(throwable);
                        });
                    }).execute(function(throwable) {
                        flow.complete(throwable);
                    });
                    break;
                default:
                    flow.complete(new Error("Unknown property '" + property + "'"));
            }
        }).execute(callback);
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

        //TODO BRN:

        room.membersList.addToSet(roomMember._id);
        room.save(function(throwable, room) {
            callback(throwable, room);
        });


        _this.dataStore.populate(returnedRoom, {path: "membersList"}, function(throwable, returnedRoom){
            room = returnedRoom;
            flow.complete(throwable);
        });



        //this.dataStore.update({id: })
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
