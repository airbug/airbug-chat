//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')

//@Require('Class')
//@Require('List')
//@Require('Obj')
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
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
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

var RoomManager = Class.extend(Obj, {

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
     * @param {Room} room
     * @param callback
     */
    createRoom: function(room, callback) {
        room.setCreatedAt(new Date());
        room.setUpdatedAt(new Date());
        this.dataStore.create(room.toObject(), function(error, dbRoom) {
            if (!error) {
                room.setId(dbRoom.id);
                callback(undefined, room);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {{
     *      conversationId: string,
     *      createdAt: Date,
     *      id: string,
     *      name: string,
     *      updatedAt: Date,
     *      roomMemberIdList: (Array.<string> | List.<string>)
     * }} data
     * @return {Room}
     */
    generateRoom: function(requestContext, data) {
        var room = new Room();
        room.setConversationId(data.conversationId);
        room.setId(data.id);
        room.setCreatedAt(data.createdAt);
        room.setName(data.name);
        room.setUpdatedAt(data.updatedAt);
        room.setRoomMemberIdList(new List(data.roomMemberIdList));
        return room;
    },

    /**
     * @param {Room} room
     * @param {Array.<string>} properties
     * @param {function(Error)} callback
     */
    populateRoom: function(room, properties, callback) {
        var _this = this;
        $forEachParallel(properties, function(flow, property) {
            switch (property) {
                case "conversation":
                    var conversationId = room.getConversationId();
                    if (conversationId) {
                        if (!room.getConversation() || room.getConversation().getId() !== conversationId) {
                            _this.conversationManager.retrieveConversation(conversationId, function(error, retrievedConversation) {
                                if (!error) {
                                    room.setConversation(retrievedConversation);
                                }
                                flow.complete(error);
                            })
                        } else {
                            flow.complete();
                        }
                    } else {
                        flow.complete();
                    }
                    break;
                case "roomMemberList":
                    var roomMemberIdList = room.getRoomMemberIdList();
                    var roomMemberList = room.getRoomMemberList();
                    var roomMemberLookups = [];
                    if (!roomMemberList) {
                        roomMemberList = new List();
                    }
                    roomMemberList.


                    $forEachParallel(roomMemberLookups, function(flow, roomMemberId) {
                        _this.roomMemberManager.retrieveRoomMember(roomMemberId, function(error, roomMember) {
                            if (!error) {
                                roomMemberList.add(roomMember);
                            }
                            flow.complete(error);
                        });
                    }).execute(function(error) {
                        if (!error) {
                            roomMemberList.setRoomMemberList(roomMemberList);
                        }
                        flow.complete(error);
                    });
                    break;
            }
        }).execute(callback);
    },

    /**
     * @param {string} roomId
     * @param {function(Error, Room)} callback
     */
    retrieveRoom: function(roomId, callback) {
        var _this = this;

        //TODO BRN: Look at using the "lean" option for retrieval to prevent from having to call .toObject on th dbRoom

        this.dataStore.findById(roomId, function(error, dbRoom) {
            if (!error) {
                var room = undefined;
                if (dbRoom) {
                    room = _this.generateRoom(dbRoom.toObject());
                    room.commitProperties();
                }
                callback(undefined, room);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Error, room)} callback
     */
    retrieveRooms: function(roomIds, callback) {
        this.dataStore.where("_id").in(roomIds).exec(function(error, results) {
            //TEST
            console.log("RetrieveRooms results", results);
        });
    },

    saveRoom: function(room, callback) {

        //TODO BRN:
        room.membersList.addToSet(roomMember._id);
        room.save(function(error, room) {
            callback(error, room);
        });


        _this.dataStore.populate(returnedRoom, {path: "membersList"}, function(error, returnedRoom){
            room = returnedRoom;
            flow.complete(error);
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
