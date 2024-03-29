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
//@Require('airbugserver.EntityController')
//@Require('airbugserver.RoomMemberController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EntityController        = bugpack.require('airbugserver.EntityController');
var RoomMemberController      = bugpack.require('airbugserver.RoomMemberController');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var roomMemberControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.roomMemberService      = {};
        this.marshaller             = {};
        this.roomMemberController = new RoomMemberController(this.controllerManager, this.expressApp, this.bugCallRouter, this.roomMemberService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.roomMemberController, EntityController),
            "Assert roomMemberController extends EntityController");
        test.assertEqual(this.roomMemberController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.roomMemberController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to roomMemberController's expressApp property");
        test.assertEqual(this.roomMemberController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to roomMemberController's expressApp property");
        test.assertEqual(this.roomMemberController.getRoomMemberService(), this.roomMemberService,
            "Assert roomMemberService has been set to roomMemberController's expressApp property");
        test.assertEqual(this.roomMemberController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to roomMemberController's marshaller property");
        test.assertNotEqual(this.roomMemberController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(roomMemberControllerInstantiationTest).with(
    test().name("RoomMemberController - instantiation Test")
);
