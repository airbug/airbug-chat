//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Room                    = bugpack.require('airbugserver.Room');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMember              = bugpack.require('airbugserver.RoomMember');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
var RoomService             = bugpack.require('airbugserver.RoomService');
var Session                 = bugpack.require('airbugserver.Session');
var User                    = bugpack.require('airbugserver.User');
var UserManager             = bugpack.require('airbugserver.UserManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger                  = bugpack.require('loggerbug.Logger');
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
 * @param {Object} meldService
 * @param {User} currentUser
 * @param {Session} session
 */
var setupRoomService = function(setupObject, meldService, currentUser, session) {
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
    setupObject.entityManagerStore      = new EntityManagerStore();
    setupObject.mongoDataStore          = new DummyMongoDataStore();
    setupObject.schemaManager           = new SchemaManager();
    setupObject.roomManager             = new RoomManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
    setupObject.roomManager.setEntityType("Room");
    setupObject.roomMemberManager       = new RoomMemberManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
    setupObject.roomMemberManager.setEntityType("RoomMember");
    setupObject.userManager             = new UserManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
    setupObject.userManager.setEntityType("User");
    setupObject.roomService             = new RoomService(setupObject.roomManager, setupObject.userManager ,setupObject.roomMemberManager, meldService);
    setupObject.roomService.logger      = new Logger();
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/*var roomServiceCreateRoomTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testCurrentUser     = new User({});
        this.testSession  = new Session({});
        this.dummyMeldManager = {

        };
        this.dummyMeldService = {
            factoryManager: function() {
                return _this.dummyMeldManager;
            }
        };
        setupRoomService(this, this.dummyMeldService, this.testCurrentUser, this.testSession);
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
                _this.roomManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.roomService.createRoom(_this.testRequestContext, _this.testRoomData, function(throwable, room) {

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
);*/

