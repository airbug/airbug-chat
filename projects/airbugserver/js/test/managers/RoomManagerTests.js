//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ISet')
//@Require('Set')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ISet                    = bugpack.require('ISet');
var Set                     = bugpack.require('Set');
var Room                    = bugpack.require('airbugserver.Room');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var DummyMongoDataStore     = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var roomManagerCreateRoomTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new DummyMongoDataStore();
        this.schemaManager          = new SchemaManager();
        this.roomManager            = new RoomManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.roomManager.setEntityType("Room");

        this.testName               = "testName";
        this.testConversationId     = "testConversationId";
        this.testRoomMemberId       = "testRoomMemberId";
        this.testRoomMemberIdSet    = new Set([this.testRoomMemberId]);
        this.testRoom               = this.roomManager.generateRoom({
            name: this.testName,
            conversationId: this.testConversationId,
            roomMemberIdSet: this.testRoomMemberIdSet
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.schemaManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomManager.createRoom(_this.testRoom, function(throwable, room) {
                    if (!throwable) {
                        test.assertEqual(room, _this.testRoom,
                            "Assert room sent in to createRoom is the same room returned");
                        var id = room.getId();
                        test.assertTrue(!!id,
                            "Assert created room has an id. id = " + id);
                        test.assertEqual(room.getName(), _this.testName,
                            "Assert that Room.name has not changed");
                        test.assertEqual(room.getConversationId(), _this.testConversationId,
                            "Assert that Room.conversationId has not changed");
                        test.assertTrue(Class.doesImplement(room.getRoomMemberIdSet(), ISet),
                            "Assert that Room.roomMemberSet is still a Set");
                        test.assertTrue(room.getRoomMemberIdSet().contains(_this.testRoomMemberId),
                            "Assert that Room.roomMemberSet contains the testRoomMemberId");
                        test.assertTrue((room.getCreatedAt() instanceof Date),
                            "Assert createdAt was set to a Date");
                        test.assertTrue((room.getUpdatedAt() instanceof Date),
                            "Assert updatedAt was set to a Date");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.complete();
            } else {
                test.error(throwable);
            }
        });
    }
};
bugmeta.annotate(roomManagerCreateRoomTest).with(
    test().name("RoomManager - #createRoom Test")
);
