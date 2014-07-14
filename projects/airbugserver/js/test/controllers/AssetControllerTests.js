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
//@Require('airbugserver.AssetController')
//@Require('airbugserver.EntityController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AssetController         = bugpack.require('airbugserver.AssetController');
var EntityController        = bugpack.require('airbugserver.EntityController');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var assetControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.assetService           = {};
        this.marshaller             = {};
        this.assetController        = new AssetController(this.controllerManager, this.expressApp, this.bugCallRouter,
            this.assetService, this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.assetController, EntityController),
            "Assert assetController extends EntityController");
        test.assertEqual(this.assetController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.assetController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to assetController's expressApp property");
        test.assertEqual(this.assetController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to assetController's bugCallRouter property");
        test.assertEqual(this.assetController.getAssetService(), this.assetService,
            "Assert assetService has been set to assetController's expressApp property");
        test.assertEqual(this.assetController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to assetController's marshaller property");
        test.assertNotEqual(this.assetController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(assetControllerInstantiationTest).with(
    test().name("AssetController - instantiation Test")
);
