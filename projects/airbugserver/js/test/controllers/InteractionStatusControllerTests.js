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
//@Require('airbugserver.InteractionStatusController')
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
var InteractionStatusController      = bugpack.require('airbugserver.InteractionStatusController');
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

var interactionStatusControllerInstantiationTest = {

    setup: function() {
        this.controllerManager          = {};
        this.expressApp                 = {};
        this.bugCallRouter              = {};
        this.interactionStatusService   = {};
        this.marshaller                 = {};
        this.interactionStatusController = new InteractionStatusController(this.controllerManager, this.expressApp, this.bugCallRouter, this.interactionStatusService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.interactionStatusController, EntityController),
            "Assert interactionStatusController extends EntityController");
        test.assertEqual(this.interactionStatusController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.interactionStatusController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getInteractionStatusService(), this.interactionStatusService,
            "Assert interactionStatusService has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to interactionStatusController's marshaller property");
        test.assertNotEqual(this.interactionStatusController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(interactionStatusControllerInstantiationTest).with(
    test().name("InteractionStatusController - instantiation Test")
);
