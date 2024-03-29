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
//@Require('airbugserver.ConversationController')
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
var ConversationController  = bugpack.require('airbugserver.ConversationController');
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

var conversationControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.conversationService    = {};
        this.marshaller             = {};
        this.conversationController = new ConversationController(this.controllerManager, this.expressApp, this.bugCallRouter, this.conversationService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.conversationController, EntityController),
            "Assert conversationController extends EntityController");
        test.assertEqual(this.conversationController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.conversationController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to conversationController's expressApp property");
        test.assertEqual(this.conversationController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to conversationController's expressApp property");
        test.assertEqual(this.conversationController.getConversationService(), this.conversationService,
            "Assert conversationService has been set to conversationController's expressApp property");
        test.assertEqual(this.conversationController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to conversationController's marshaller property");
        test.assertNotEqual(this.conversationController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(conversationControllerInstantiationTest).with(
    test().name("ConversationController - instantiation Test")
);
