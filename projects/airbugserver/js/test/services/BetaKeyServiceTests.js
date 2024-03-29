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
//@Require('airbugserver.BetaKey')
//@Require('airbugserver.BetaKeyService')
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
    var BetaKey         = bugpack.require('airbugserver.BetaKey');
    var BetaKeyService  = bugpack.require('airbugserver.BetaKeyService');
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

    bugyarn.registerWinder("setupTestBetaKeyService", function(yarn) {
        yarn.spin([
            "setupMockSuccessPushTaskManager",
            "setupTestBetaKeyManager",
            "setupTestBetaKeyPusher",
            "setupTestLogger"
        ]);
        yarn.wind({
            betaKeyService: new BetaKeyService(this.logger, this.betaKeyManager, this.betaKeyPusher)
        });
    });


    //-------------------------------------------------------------------------------
    // Setup Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Yarn} yarn
     * @param {Object} setupObject
     */
    var setupBetaKeyService = function(yarn, setupObject) {
        setupObject.marshRegistry.configureModule();
        setupObject.schemaManager.configureModule();
        setupObject.mongoDataStore.configureModule();
        setupObject.testCurrentUser     = yarn.weave("testNotAnonymousUser");
        setupObject.testSession         = yarn.weave("testSession");
        setupObject.testCall            = yarn.weave("testCall");
        setupObject.testRequestContext  = {
            get: function(key) {
                if (key === "currentUser") {
                    return setupObject.testCurrentUser;
                } else if (key === "session") {
                    return setupObject.testSession;
                } else if (key === "call") {
                    return setupObject.testCall;
                }
                return undefined;
            },
            set: function(key, value) {

            }
        };
    };

    var initializeBetaKeyService = function(setupObject, callback) {
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
                setupObject.betaKeyManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var betaKeyServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestBetaKeyManager",
                "setupTestBetaKeyPusher",
                "setupTestLogger"
            ]);
            this.testBetaKeyService     = new BetaKeyService(this.logger, this.betaKeyManager, this.betaKeyPusher);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testBetaKeyService, BetaKeyService),
                "Assert instance of BetaKeyService");
            test.assertEqual(this.testBetaKeyService.getBetaKeyManager(), this.betaKeyManager,
                "Assert .betaKeyManager was set correctly");
            test.assertEqual(this.testBetaKeyService.getBetaKeyPusher(), this.betaKeyPusher,
                "Assert .betaKeyPusher was set correctly");
            test.assertEqual(this.testBetaKeyService.getLogger(), this.logger,
                "Assert .logger was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(betaKeyServiceInstantiationTest).with(
        test().name("BetaKeyService - instantiation test")
    );
});
