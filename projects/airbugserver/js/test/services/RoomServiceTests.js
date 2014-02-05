//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.AirbugCallManager')
//@Require('airbugserver.AirbugCallService')
//@Require('airbugserver.ChatMessageStreamManager')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionManager')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
//@Require('bugcall.Call')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldStore')
//@Require('meldbugserver.MeldManagerFactory')
//@Require('meldbugserver.MeldBucketStore')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var AirbugCallManager           = bugpack.require('airbugserver.AirbugCallManager');
var AirbugCallService           = bugpack.require('airbugserver.AirbugCallService');
var ChatMessageStreamManager    = bugpack.require('airbugserver.ChatMessageStreamManager');
var Conversation                = bugpack.require('airbugserver.Conversation');
var ConversationManager         = bugpack.require('airbugserver.ConversationManager');
var Room                        = bugpack.require('airbugserver.Room');
var RoomManager                 = bugpack.require('airbugserver.RoomManager');
var RoomMember                  = bugpack.require('airbugserver.RoomMember');
var RoomMemberManager           = bugpack.require('airbugserver.RoomMemberManager');
var RoomService                 = bugpack.require('airbugserver.RoomService');
var Session                     = bugpack.require('airbugserver.Session');
var SessionManager              = bugpack.require('airbugserver.SessionManager');
var User                        = bugpack.require('airbugserver.User');
var UserManager                 = bugpack.require('airbugserver.UserManager');
var Call                        = bugpack.require('bugcall.Call');
var DeltaBuilder                = bugpack.require('bugdelta.DeltaBuilder');
var EntityManagerStore          = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager               = bugpack.require('bugentity.SchemaManager');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger                      = bugpack.require('loggerbug.Logger');
var MeldBuilder                 = bugpack.require('meldbug.MeldBuilder');
var DummyMongoDataStore         = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestAnnotation.test;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

/**
 * @param {Object} setupObject
 * @param {Object} currentUserObject
 * @param {Object} sessionObject
 */
var setupRoomService = function(setupObject, currentUserObject, sessionObject) {

    setupObject.dummyBugCallServer      = {
        on: function() {}
    };
    setupObject.roomPusher              = {
        meldCallWithRoom: function(callUuid, room, callback) {
            callback();
        },
        pushRoomToCall: function(room, callUuid, callback) {
            callback();
        },
        pushRoom: function(room, waitForCallUuids, callback) {
            callback();
        }
    };
    setupObject.userPusher              = {
        pushUser: function(user, waitForCallUuids, callback) {
            callback();
        }
    };
    setupObject.roomMemberPusher        = {};
    setupObject.chatMessageStreamManager = new ChatMessageStreamManager();
    setupObject.dummyRedisClient        = {};
    setupObject.airbugCallManager       = new AirbugCallManager(setupObject.dummyRedisClient);
    setupObject.meldBuilder             = new MeldBuilder();
    setupObject.entityManagerStore      = new EntityManagerStore();
    setupObject.mongoDataStore          = new DummyMongoDataStore();
    setupObject.schemaManager           = new SchemaManager();
    setupObject.roomManager             = new RoomManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.roomManager.setEntityType("Room");
    setupObject.roomMemberManager       = new RoomMemberManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.roomMemberManager.setEntityType("RoomMember");
    setupObject.userManager             = new UserManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.userManager.setEntityType("User");
    setupObject.conversationManager     = new ConversationManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.conversationManager.setEntityType("Conversation");
    setupObject.sessionManager          = new SessionManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.sessionManager.setEntityType("Session");
    setupObject.airbugCallService       = new AirbugCallService(setupObject.dummyBugCallServer, setupObject.airbugCallManager, setupObject.sessionManager);
    setupObject.roomService             = new RoomService(setupObject.roomManager, setupObject.userManager ,setupObject.roomMemberManager, setupObject.chatMessageStreamManager, setupObject.roomPusher, setupObject.userPusher, setupObject.roomMemberPusher);
    setupObject.logger                  = new Logger();
    setupObject.roomService.logger      = setupObject.logger;
    setupObject.testCurrentUser = setupObject.userManager.generateUser(currentUserObject);
    setupObject.testSession     = setupObject.sessionManager.generateSession(sessionObject);
    setupObject.testCall = new Call(setupObject.logger, sessionObject.testCallUuid);
    setupObject.testRequestContext  = {
        get: function(key) {
            if (key === "currentUser") {
                return setupObject.testCurrentUser;
            } else if (key === "session") {
                return setupObject.testSession;
            } else if (key === "call") {
                return setupObject.testCall;
            }
            return undefined;
        },
        set: function(key, value) {

        }
    };
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var roomServiceCreateRoomTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testCurrentUserObject    = {
            firstName: "testFirstName",
            lstName: "testLastName"
        };
        this.testSessionObject        = {
            cookie: {

            }
        };
        this.testCallUuid = "abc123";
        setupRoomService(this, this.testCurrentUserObject, this.testSessionObject);
        this.testName       = "testName";
        this.testRoomData   = {
            name: this.testName
        }
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
                _this.conversationManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomMemberManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.createUser(_this.testCurrentUser, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.createSession(_this.testSession, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomService.createRoom(_this.testRequestContext, _this.testRoomData, function(throwable, room) {
                    if (!throwable) {
                        test.assertEqual(room.getName(), _this.testName,
                            "Assert that room#getName returns testName");
                        test.assertTrue(!!room.getId(),
                            "Assert that an id has been generated for the room");
                        test.assertEqual(room.getRoomMemberIdSet().getCount(), 1,
                            "Assert that the room has 1 room member");
                        var roomMember = room.getRoomMemberSet().toArray()[0];
                        test.assertTrue(room.getRoomMemberIdSet().contains(roomMember.getId()),
                            "Assert that the roomMemberIdSet contains the new roomMember's id");

                        var deltaBuilder    = new DeltaBuilder();
                        var testDelta       = deltaBuilder.buildDelta(room.getDeltaDocument(), room.getDeltaDocument().getPreviousDocument());
                        test.assertEqual(testDelta.getChangeCount(), 0,
                            "Assert that the Entity has been committed and there are no pending changes");
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
bugmeta.annotate(roomServiceCreateRoomTest).with(
    test().name("RoomService - #createRoom Test")
);
