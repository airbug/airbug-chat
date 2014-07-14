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
//@Require('Obj')
//@Require('airbugserver.BetaKey')
//@Require('airbugserver.BetaKeyManager')
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
    var Obj             = bugpack.require('Obj');
    var BetaKey         = bugpack.require('airbugserver.BetaKey');
    var BetaKeyManager  = bugpack.require('airbugserver.BetaKeyManager');
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

    bugyarn.registerWeaver("testBetaKey", function(yarn, args) {
        yarn.spin([
            "setupTestBetaKeyManager"
        ]);

        var betaKeyData         = args[0] || {};
        var testBetaKeyData     = Obj.merge(betaKeyData, {
            baseKey: "testBaseKey",
            betaKey: "testBetaKey",
            cap: 10,
            createdAt: new Date(Date.now()),
            count: 0,
            hasCap: true,
            isBaseKey: true,
            secondaryKeys: [
                "secondaryKey"
            ],
            updatedAt: new Date(Date.now()),
            version: "0.0.2"
        });
        return this.betaKeyManager.generateBetaKey(testBetaKeyData);
    });

    bugyarn.registerWinder("setupTestBetaKeyManager", function(yarn) {
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        yarn.wind({
            betaKeyManager: new BetaKeyManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
        });
        this.betaKeyManager.setEntityType("BetaKey");
    });


    //-------------------------------------------------------------------------------
    // Declare Setup Objects
    //-------------------------------------------------------------------------------

    var setupBetaKeyManager = function(setupObject) {
        setupObject.schemaManager.configureModule();
        setupObject.mongoDataStore.configureModule();
    };

    var initializeManagers = function(setupObject, callback) {
        $series([
            $task(function(flow) {
                setupObject.betaKeyManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };

    var setupBetaKeyEntity = function(yarn, setupObject, callback) {
        setupObject.testBetaKey = yarn.weave("testBetaKey");
        $series([
            $task(function(flow) {
                setupObject.betaKeyManager.createBetaKey(setupObject.testBetaKey, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var betaKeyManagerInstantiationTest = {

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
            this.testBetaKeyManager   = new BetaKeyManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testBetaKeyManager, BetaKeyManager),
                "Assert instance of BetaKeyManager");
            test.assertEqual(this.testBetaKeyManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
            test.assertEqual(this.testBetaKeyManager.getEntityDataStore(), this.mongoDataStore,
                "Assert .entityDataStore was set correctly");
            test.assertEqual(this.testBetaKeyManager.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testBetaKeyManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
                "Assert .entityDeltaBuilder was set correctly");
        }
    };

    var betaKeyManagerRetrieveBetaKeyByBetaKeyTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestBetaKeyManager"
            ]);
            setupBetaKeyManager(this);
            $series([
                $task(function(flow) {
                    initializeManagers(_this, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    setupBetaKeyEntity(yarn, _this, function(throwable) {
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
            $task(function(flow) {
                _this.betaKeyManager.retrieveBetaKeyByBetaKey(_this.testBetaKey.getBetaKey(), function(throwable, betaKey) {
                    if (!throwable) {
                        test.assertEqual(betaKey.getId(), _this.testBetaKey.getId(),
                            "retrieveBetaKey should return proper entity object");
                    }
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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

    bugmeta.tag(betaKeyManagerInstantiationTest).with(
        test().name("BetaKeyManager - instantiation test")
    );

    bugmeta.tag(betaKeyManagerRetrieveBetaKeyByBetaKeyTest).with(
        test().name("BetaKeyManager - #retrieveBetaKeyByBetaKey Test")
    );
});
