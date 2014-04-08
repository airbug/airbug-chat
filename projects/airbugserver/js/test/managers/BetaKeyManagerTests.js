//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.BetaKey')
//@Require('airbugserver.BetaKeyManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var BetaKey                 = bugpack.require('airbugserver.BetaKey');
var BetaKeyManager          = bugpack.require('airbugserver.BetaKeyManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


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
    setupObject.schemaManager.processModule();
    setupObject.mongoDataStore.processModule();
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

bugmeta.annotate(betaKeyManagerInstantiationTest).with(
    test().name("BetaKeyManager - instantiation test")
);

bugmeta.annotate(betaKeyManagerRetrieveBetaKeyByBetaKeyTest).with(
    test().name("BetaKeyManager - #retrieveBetaKeyByBetaKey Test")
);