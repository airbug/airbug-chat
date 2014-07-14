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
//@Require('airbugserver.AssetPusher')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AssetPusher             = bugpack.require('airbugserver.AssetPusher');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestAssetPusher", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupTestMeldBuilder",
        "setupTestMeldManager",
        "setupTestPushManager",
        "setupTestUserManager",
        "setupTestMeldSessionManager"
    ]);
    yarn.wind({
        assetPusher: new AssetPusher(this.logger, this.meldBuilder, this.meldManager, this.pushManager, this.userManager, this.meldSessionManager)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var assetPusherInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestMeldBuilder",
            "setupTestMeldManager",
            "setupTestPushManager",
            "setupTestUserManager",
            "setupTestMeldSessionManager"
        ]);
        this.testAssetPusher    = new AssetPusher(this.logger, this.meldBuilder, this.meldManager, this.pushManager, this.userManager, this.meldSessionManager);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testAssetPusher, AssetPusher),
            "Assert instance of AssetPusher");
        test.assertEqual(this.testAssetPusher.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testAssetPusher.getMeldBuilder(), this.meldBuilder,
            "Assert .meldBuilder was set correctly");
        test.assertEqual(this.testAssetPusher.getMeldManager(), this.meldManager,
            "Assert .meldManager was set correctly");
        test.assertEqual(this.testAssetPusher.getPushManager(), this.pushManager,
            "Assert .pushManager was set correctly");
        test.assertEqual(this.testAssetPusher.getUserManager(), this.userManager,
            "Assert .userManager was set correctly");
        test.assertEqual(this.testAssetPusher.getMeldSessionManager(), this.meldSessionManager,
            "Assert .meldSessionManager was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(assetPusherInstantiationTest).with(
    test().name("AssetPusher - instantiation test")
);
