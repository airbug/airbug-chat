/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbug.ApiDefines')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.Room')
//@Require('airbugserver.RoomController')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugroute.BugCallRouter')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ApiDefines          = bugpack.require('airbug.ApiDefines');
    var EntityController    = bugpack.require('airbugserver.EntityController');
    var Room                = bugpack.require('airbugserver.Room');
    var RoomController      = bugpack.require('airbugserver.RoomController');
    var BugDouble           = bugpack.require('bugdouble.BugDouble');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var BugCallRouter       = bugpack.require('bugroute.BugCallRouter');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var spyOnFunction       = BugDouble.spyOnFunction;
    var spyOnObject         = BugDouble.spyOnObject;
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var roomControllerInstantiationTest = {

        setup: function() {
            this.controllerManager      = {};
            this.expressApp             = {};
            this.bugCallRouter          = {};
            this.roomService            = {};
            this.marshaller             = {};
            this.roomController         = new RoomController(this.controllerManager, this.expressApp, this.bugCallRouter,
                this.roomService, this.marshaller);
        },

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.roomController, EntityController),
                "Assert roomController extends EntityController");
            test.assertEqual(this.roomController.getControllerManager(), this.controllerManager,
                "Assert controllerManager has been set properly");
            test.assertEqual(this.roomController.getExpressApp(), this.expressApp,
                "Assert expressApp has been set to roomController's expressApp property");
            test.assertEqual(this.roomController.getBugCallRouter(), this.bugCallRouter,
                "Assert bugCallRouter has been set to roomController's bugCallRouter property");
            test.assertEqual(this.roomController.getRoomService(), this.roomService,
                "Assert roomService has been set to roomController's expressApp property");
            test.assertEqual(this.roomController.getMarshaller(), this.marshaller,
                "Assert marshaller has been set to roomController's marshaller property");
            test.assertNotEqual(this.roomController.getMarshaller(), undefined,
                "Assert marshaller is not undefined");
        }
    };
    bugmeta.tag(roomControllerInstantiationTest).with(
        test().name("RoomController - instantiation Test")
    );


    /**
     * This tests...
     * 1) That joinRoom was called on the service object
     * 2) That the requestContext and roomId was sent to the joinRoom method
     */
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
            this.testResponder           = {
                response: function(responseType, data) {
                    test.assertEqual(responseType, ApiDefines.Responses.SUCCESS,
                        "Assert responseType was success");
                    return {};
                },
                sendResponse: function(response, callback) {
                    callback();
                }
            };
            this.testCallback           = function(throwable) {
                test.assertTrue(!throwable,
                    "Assert throwable was not thrown");
            };
            this.testCallbackSpy        = spyOnFunction(this.testCallback);
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

                    callback();
                }
            };
            this.dummyRoomServiceSpy    = spyOnObject(this.dummyRoomService);
            this.dummyControllerManager = {};
            this.roomController         = new RoomController(this.dummyControllerManager, this.dummyExpressApp, this.testBugCallRouter, this.dummyRoomService);
            this.roomController.configure(function() {});
        },

        test: function(test) {
            this.testBugCallRouter.processRequest(this.testRequest, this.testResponder, this.testCallbackSpy);
            test.assertTrue(this.dummyRoomServiceSpy.getSpy("joinRoom").wasCalled(),
                "Assert RoomService#joinRoom was called");
            test.assertTrue(this.testCallbackSpy.wasCalled(),
                "Assert callback was fired");
        }
    };
    bugmeta.tag(roomControllerJoinRoomTest).with(
        test().name("RoomController - #joinRoom Test")
    );



    /**
     * This tests...
     * 1) That createRoom was called on the service object
     * 2) That the requestContext and roomId was sent to the joinRoom method
     */
    var roomControllerCreateRoomTest = {

        setup: function(test) {
            var _this                   = this;
            this.testRoomName           = "testRoomName";
            this.testRoomId             = "testRoomId";
            this.testData               = {
                object: {
                    name: this.testRoomName
                }
            };
            this.testType               = "createRoom";
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
            this.testResponder           = {
                response: function(responseType, data) {
                    test.assertEqual(responseType, ApiDefines.Responses.SUCCESS,
                        "Assert responseType was success");
                    test.assertEqual(data.objectId, _this.testRoomId,
                        "Assert data.objectId was set to the testRoomId");
                    return {};
                },
                sendResponse: function(response, callback) {
                    callback();
                }
            };
            this.testCallback           = function(throwable) {
                test.assertTrue(!throwable,
                    "Assert throwable was not thrown");
            };
            this.testCallbackSpy        = spyOnFunction(this.testCallback);
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
                createRoom: function(requestContent, roomData, callback) {
                    test.assertEqual(requestContent, _this.testRequestContext,
                        "Assert createRoom was called with the testRequestContext");
                    test.assertEqual(roomData, _this.testData.object,
                        "Assert createRoom was called with the data object");
                    test.assertEqual(roomData.name, _this.testRoomName,
                        "Assert roomData.name is testRoomName");

                    var room = new Room({
                        name: roomData.name
                    });
                    room.setId(_this.testRoomId);
                    callback(null, room);
                }
            };
            this.dummyRoomServiceSpy    = spyOnObject(this.dummyRoomService);
            this.dummyControllerManager = {};
            this.roomController         = new RoomController(this.dummyControllerManager, this.dummyExpressApp, this.testBugCallRouter, this.dummyRoomService);
            this.roomController.configure(function() {});
        },

        test: function(test) {
            this.testBugCallRouter.processRequest(this.testRequest, this.testResponder, this.testCallbackSpy);
            test.assertTrue(this.dummyRoomServiceSpy.getSpy("createRoom").wasCalled(),
                "Assert RoomService#createRoom was called");
            test.assertTrue(this.testCallbackSpy.wasCalled(),
                "Assert callback was fired");
        }
    };
    bugmeta.tag(roomControllerCreateRoomTest).with(
        test().name("RoomController - #createRoom Test")
    );
});
