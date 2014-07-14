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
//@Require('Flows')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetManager')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Flows           = bugpack.require('Flows');
    var Asset           = bugpack.require('airbugserver.Asset');
    var AssetManager    = bugpack.require('airbugserver.AssetManager');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;
    var $series         = Flows.$series;
    var $task           = Flows.$task;


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
    // BugUnit Tests
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
});
