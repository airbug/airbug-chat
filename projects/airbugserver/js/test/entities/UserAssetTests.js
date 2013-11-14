//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.Asset')
//@Require('airbugserver.User')
//@Require('airbugserver.UserAsset')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


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
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var userAssetBasicsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testUser = new User({
            
        });
        this.testAsset = new Asset({
            
        });
        this.testAssetId = "testAssetId";
        this.testUserId = "testUserId";
        this.testUserAsset = new UserAsset({
            assetId: this.testAssetId,
            userId: this.testUserId
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testUserAsset.getAssetId(), this.testAssetId,
            "Assert UserAsset.assetId was set correctly");
        test.assertEqual(this.testUserAsset.getUserId(), this.testUserId,
            "Assert UserAsset.userId was set correctly");

        // Verify setters work
        this.testUserAsset.setAssetId("otherTestAssetId");
        test.assertEqual(this.testUserAsset.getAssetId(), "otherTestAssetId",
            "Assert UserAsset.setAssetId works correctly");
        this.testUserAsset.setUserId("otherTestUserId");
        test.assertEqual(this.testUserAsset.getUserId(), "otherTestUserId",
            "Assert UserAsset.setUserId works correctly");

        // Verify public methods for asset
        this.testAsset.setId("ASSETID");
        this.testUserAsset.setAsset(this.testAsset);
        test.assertEqual(this.testUserAsset.getAssetId(), "ASSETID",
            "Assert UserAsset.setAsset works correctly");
        test.assertTrue(!!this.testUserAsset.getAsset());

        // Verify public methods for user
        this.testUser.setId("USERID");
        this.testUserAsset.setUser(this.testUser);
        test.assertEqual(this.testUserAsset.getUserId(), "USERID",
            "Assert UserAsset.setUser works correctly");
        test.assertTrue(!!this.testUserAsset.getUser());
    }
};
bugmeta.annotate(userAssetBasicsTest).with(
    test().name("UserAsset - instantiation and getter/setter Test")
);
