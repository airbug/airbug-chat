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

//@Require('UuidGenerator')
//@Require('airbugserver.Asset')
//@Require('airbugserver.User')
//@Require('airbugserver.UserAsset')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var Asset                   = bugpack.require('airbugserver.Asset');
var User                    = bugpack.require('airbugserver.User');
var UserAsset               = bugpack.require('airbugserver.UserAsset');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


var setupAssetTest = function(setupObject) {
    setupObject.testUser        = new User({

    });
    setupObject.testAsset       = new Asset({

    });
    setupObject.testAssetId     = "testAssetId";
    setupObject.testName        = "testName";
    setupObject.testUserId      = "testUserId";
    setupObject.testUserAsset   = new UserAsset({
        assetId: setupObject.testAssetId,
        name: setupObject.testName,
        userId: setupObject.testUserId
    });
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var userAssetInstantiationTest =  {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTest(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testUserAsset.getAssetId(), this.testAssetId,
            "Assert UserAsset.assetId was set correctly");
        test.assertEqual(this.testUserAsset.getName(), this.testName,
            "Assert UserAsset.name was set correctly");
        test.assertEqual(this.testUserAsset.getUserId(), this.testUserId,
            "Assert UserAsset.userId was set correctly");
    }
}

var userAssetSettersGettersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTest(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify setters and getters work
        this.testUserAsset.setAssetId("otherTestAssetId");
        test.assertEqual(this.testUserAsset.getAssetId(), "otherTestAssetId",
            "Assert UserAsset.setAssetId works correctly");
        this.testUserAsset.setName("otherTestName");
        test.assertEqual(this.testUserAsset.getName(), "otherTestName"),
            "Assert UserAsset.setNane works correctly";
        this.testUserAsset.setUserId("otherTestUserId");
        test.assertEqual(this.testUserAsset.getUserId(), "otherTestUserId",
            "Assert UserAsset.setUserId works correctly");
    }
};

var userAssetPublicMethodsForAssetPropertyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTest(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify public methods for asset
        this.testAsset.setId("ASSETID");
        this.testUserAsset.setAsset(this.testAsset);
        test.assertEqual(this.testUserAsset.getAssetId(), "ASSETID",
            "Assert UserAsset.setAsset works correctly");
        test.assertTrue(!!this.testUserAsset.getAsset());
    }
};

var userAssetPublicMethodsForUserPropertyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTest(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify public methods for user
        this.testUser.setId("USERID");
        this.testUserAsset.setUser(this.testUser);
        test.assertEqual(this.testUserAsset.getUserId(), "USERID",
            "Assert UserAsset.setUser works correctly");
        test.assertTrue(!!this.testUserAsset.getUser());
    }
};

bugmeta.tag(userAssetInstantiationTest).with(
    test().name("UserAsset - instantiation Test")
);

bugmeta.tag(userAssetSettersGettersTest).with(
    test().name("UserAsset - setters/getters Test")
);

bugmeta.tag(userAssetPublicMethodsForAssetPropertyTest).with(
    test().name("UserAsset - Public methods for Asset Property Test")
);

bugmeta.tag(userAssetPublicMethodsForUserPropertyTest).with(
    test().name("UserAsset - Public methods for User Property Test")
);
