//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetManager')
//@Require('bugflow.BugFlow')
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
var Asset                   = bugpack.require('airbugserver.Asset');
var AssetManager            = bugpack.require('airbugserver.AssetManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupDummyAssetManager", function(yarn) {
    var dummyAssetManager = {
        createAsset: function(asset, callback) {
            callback(asset);
        },
        deleteAsset: function(asset, callback) {
            callback();
        },
        generateAsset: function(assetObject) {
            return new Asset(assetObject);
        },
        retrieveAsset: function(assetId, callback) {
            var asset = new Asset({
                id: assetId
            });
            callback(null, asset);
        }
    };
    yarn.wind({
        assetManager: dummyAssetManager
    });
});

bugyarn.registerWinder("setupTestAssetManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        assetManager: new AssetManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.assetManager.setEntityType("Asset");
});


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

var assetManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        this.testAssetManager   = new AssetManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testAssetManager, AssetManager),
            "Assert instance of AssetManager");
        test.assertEqual(this.testAssetManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testAssetManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testAssetManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testAssetManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};
bugmeta.tag(assetManagerInstantiationTest).with(
    test().name("AssetManager - instantiation test")
);
