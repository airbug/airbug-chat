//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.RoomController')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EntityController        = bugpack.require('airbugserver.EntityController');
var RoomController          = bugpack.require('airbugserver.RoomController');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var BugCallRouter           = bugpack.require('bugroute:bugcall.BugCallRouter');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var spyOnObject             = BugDouble.spyOnObject;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var roomControllerInstantiationTest = {

    setup: function() {
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.roomService            = {};
        this.roomController         = new RoomController(this.expressApp, this.bugCallRouter, this.roomService);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.roomController, EntityController),
            "Assert roomController extends EntityController");
        test.assertEqual(this.roomController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to roomController's expressApp property");
        test.assertEqual(this.roomController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to roomController's bugCallRouter property");
        test.assertEqual(this.roomController.getRoomService(), this.roomService,
            "Assert roomService has been set to roomController's expressApp property");
    }
};
bugmeta.annotate(roomControllerInstantiationTest).with(
    test().name("RoomController - instantiation Test")
);


var roomControllerJoinRoomTest = {

    setup: function(test) {
        var _this                   = this;
        this.testRoomId             = "testRoomId";
        this.testData               = {
            roomId: this.testRoomId
        };
        this.testType               = "joinRoom";
        this.testRequestContext     = {};
        this.testRequest            = {
            getData: function() {
                return _this.testData;
            },
            getType: function() {
                return _this.testType;
            },
            requestContext: this.testRequestContext
        };
        this.testRsponder           = {};
        this.testCallback           = function(throwable) {};
        this.dummyExpressApp        = {
            get: function() {

            },
            post: function() {

            },
            put: function() {

            },
            delete: function() {

            }
        };
        this.testBugCallRouter      = new BugCallRouter();
        this.dummyRoomService       = {
            joinRoom: function(requestContent, roomId, callback) {
                test.assertEqual(requestContent, _this.testRequestContext,
                    "Assert joinRoom was called with the testRequestContext");
                test.assertEqual(roomId, _this.testRoomId,
                    "Assert joinRoom was called with the testRoomId");

                //TODO BRN: Fire the callback here and validate that the testCallback is fired
            }
        };
        this.dummyRoomServiceSpy    = spyOnObject(this.dummyRoomService);
        this.roomController         = new RoomController(this.dummyExpressApp, this.testBugCallRouter, this.dummyRoomService);
        this.roomController.configure();
    },

    test: function(test) {
        this.testBugCallRouter.processRequest(this.testRequest, this.testRsponder, this.testCallback);
        test.assertTrue(this.dummyRoomServiceSpy.getSpy("joinRoom").wasCalled(),
            "Assert RoomService#joinRoom was called");
    }
};
bugmeta.annotate(roomControllerJoinRoomTest).with(
    test().name("RoomController - #joinRoom Test")
);
