//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@require('airbugserver.CallService')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.MeldService')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionManager')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
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
//@Require('meldbugserver.MeldMirrorStore')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CallService             = bugpack.require('airbugserver.CallService');
var Conversation            = bugpack.require('airbugserver.Conversation');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
var MeldService             = bugpack.require('airbugserver.MeldService');
var Room                    = bugpack.require('airbugserver.Room');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMember              = bugpack.require('airbugserver.RoomMember');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
var RoomService             = bugpack.require('airbugserver.RoomService');
var Session                 = bugpack.require('airbugserver.Session');
var SessionManager          = bugpack.require('airbugserver.SessionManager');
var User                    = bugpack.require('airbugserver.User');
var UserManager             = bugpack.require('airbugserver.UserManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger                  = bugpack.require('loggerbug.Logger');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldBuilder             = bugpack.require('meldbug.MeldBuilder');
var MeldStore               = bugpack.require('meldbug.MeldStore');
var MeldManagerFactory      = bugpack.require('meldbugserver.MeldManagerFactory');
var MeldMirrorStore         = bugpack.require('meldbugserver.MeldMirrorStore');
var DummyMongoDataStore     = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


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
    setupObject.callService             = new CallService(setupObject.dummyBugCallServer);
    setupObject.meldBucket              = new MeldBucket();
    setupObject.meldStore               = new MeldStore(setupObject.meldBucket);
    setupObject.meldBuilder             = new MeldBuilder();
    setupObject.meldMirrorStore         = new MeldMirrorStore();
    setupObject.meldManagerFactory      = new MeldManagerFactory(setupObject.meldStore, setupObject.meldMirrorStore);
    setupObject.meldService             = new MeldService(setupObject.meldManagerFactory, setupObject.meldBuilder, setupObject.callService);
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
    setupObject.roomService             = new RoomService(setupObject.roomManager, setupObject.userManager ,setupObject.roomMemberManager, setupObject.meldService);
    setupObject.roomService.logger      = new Logger();

    setupObject.testCurrentUser = setupObject.userManager.generateUser(currentUserObject);
    setupObject.testSession     = setupObject.sessionManager.generateSession(sessionObject);
    setupObject.testRequestContext  = {
        get: function(key) {
            if (key === "currentUser") {
                return setupObject.testCurrentUser;
            } else if (key === "session") {
                return setupObject.testSession;
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
