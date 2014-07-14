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
//@Require('airbugserver.ChatMessageStreamController')
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
var ChatMessageStreamController  = bugpack.require('airbugserver.ChatMessageStreamController');
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

var chatMessageStreamControllerInstantiationTest = {

    setup: function() {
        this.controllerManager          = {};
        this.expressApp                 = {};
        this.bugCallRouter              = {};
        this.chatMessageStreamService   = {};
        this.marshaller                 = {};
        this.chatMessageStreamController = new ChatMessageStreamController(this.controllerManager, this.expressApp, this.bugCallRouter, this.chatMessageStreamService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.chatMessageStreamController, EntityController),
            "Assert chatMessageStreamController extends EntityController");
        test.assertEqual(this.chatMessageStreamController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.chatMessageStreamController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to chatMessageStreamController's expressApp property");
        test.assertEqual(this.chatMessageStreamController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to chatMessageStreamController's expressApp property");
        test.assertEqual(this.chatMessageStreamController.getChatMessageStreamService(), this.chatMessageStreamService,
            "Assert chatMessageStreamService has been set to chatMessageStreamController's expressApp property");
        test.assertEqual(this.chatMessageStreamController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to chatMessageStreamController's marshaller property");
        test.assertNotEqual(this.chatMessageStreamController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(chatMessageStreamControllerInstantiationTest).with(
    test().name("ChatMessageStreamController - instantiation Test")
);
