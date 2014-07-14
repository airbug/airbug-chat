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
//@Require('airbugserver.ChatMessageController')
//@Require('airbugserver.EntityController')
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
var ChatMessageController   = bugpack.require('airbugserver.ChatMessageController');
var EntityController        = bugpack.require('airbugserver.EntityController');
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

var chatMessageControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.chatMessageService     = {};
        this.marshaller             = {};
        this.chatMessageController  = new ChatMessageController(this.controllerManager, this.expressApp, this.bugCallRouter,
            this.chatMessageService, this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.chatMessageController, EntityController),
            "Assert chatMessageController extends EntityController");
        test.assertEqual(this.chatMessageController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.chatMessageController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to chatMessageController's expressApp property");
        test.assertEqual(this.chatMessageController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to chatMessageController's expressApp property");
        test.assertEqual(this.chatMessageController.getChatMessageService(), this.chatMessageService,
            "Assert chatMessageService has been set to chatMessageController's expressApp property");
        test.assertEqual(this.chatMessageController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to chatMessageController's marshaller property");
        test.assertNotEqual(this.chatMessageController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(chatMessageControllerInstantiationTest).with(
    test().name("ChatMessageController - instantiation Test")
);
