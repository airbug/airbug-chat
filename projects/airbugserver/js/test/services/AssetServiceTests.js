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
//@Require('Exception')
//@Require('Flows')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetService')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Flows           = bugpack.require('Flows');
    var Asset           = bugpack.require('airbugserver.Asset');
    var AssetService    = bugpack.require('airbugserver.AssetService');
    var Session         = bugpack.require('airbugserver.Session');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var Logger          = bugpack.require('loggerbug.Logger');


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

    bugyarn.registerWinder("setupTestAssetService", function(yarn) {
        yarn.spin([
            "setupMockSuccessPushTaskManager",
            "setupTestLogger",
            "setupTestAssetManager",
            "setupTestAssetPusher",
            "setupDummyAwsUploader"
        ]);
        yarn.wind({
            imagemagick: {
                identify: function() {},
                resize: function() {}
            }
        });
        yarn.wind({
            assetService: new AssetService(this.logger, this.assetManager, this.assetPusher, this.awsUploader, this.imagemagick)
        });
    });


    //-------------------------------------------------------------------------------
    // Setup Methods
    //-------------------------------------------------------------------------------

    var setupAssetService = function(setupObject, callback) {
        $series([
            $task(function(flow) {
                setupObject.blockingRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.subscriberRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisPubSub.initialize(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.pubSub.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.schemaManager.configureModule();
                setupObject.mongoDataStore.configureModule();
                setupObject.assetManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var assetServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger",
                "setupTestAssetManager",
                "setupTestAssetPusher",
                "setupDummyAwsUploader"
            ]);
            yarn.wind({
                imagemagick: {
                    identify: function() {},
                    resize: function() {}
                }
            });
            this.testAssetService   = new AssetService(this.logger, this.assetManager, this.assetPusher, this.awsUploader, this.imagemagick);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testAssetService, AssetService),
                "Assert instance of AssetService");
            test.assertEqual(this.testAssetService.getAssetManager(), this.assetManager,
                "Assert .assetManager was set correctly");
            test.assertEqual(this.testAssetService.getAssetPusher(), this.assetPusher,
                "Assert .assetPusher was set correctly");
            test.assertEqual(this.testAssetService.getAwsUploader(), this.awsUploader,
                "Assert .awsUploader was set correctly");
            test.assertEqual(this.testAssetService.getImagemagick(), this.imagemagick,
                "Assert .imagemagick was set correctly");
            test.assertEqual(this.testAssetService.getLogger(), this.logger,
                "Assert .logger was set correctly");
        }
    };
    bugmeta.tag(assetServiceInstantiationTest).with(
        test().name("AssetService - instantiation test")
    );

    var assetServiceUploadAssetTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin("setupTestAssetService");
            test.completeSetup();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            // TODO - dkk - implement
            test.completeTest();
        }
    };

    var assetServiceAddAssetFromUrlTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin("setupTestAssetService");
            test.completeSetup();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            // TODO - dkk - implement
            test.completeTest();
        }
    };

    var assetServiceDeleteAssetTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestAssetService"
            ]);
            $series([
                $task(function(flow) {
                    setupAssetService(_this, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.assetService.deleteAsset(_this.testRequestContext, "testAssetId", function(throwable, asset) {
                        test.assertEqual(throwable.getType(), "NotFound",
                            "Assert throwable is of type 'NotFound'");
                        flow.complete();
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(assetServiceUploadAssetTest).with(
        test().name("AssetService - Upload Asset Test")
    );
    bugmeta.tag(assetServiceAddAssetFromUrlTest).with(
        test().name("AssetService - Add Asset From Url Test")
    );
    bugmeta.tag(assetServiceDeleteAssetTest).with(
        test().name("AssetService - Delete Asset Test")
    );
});
