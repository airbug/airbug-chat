//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Action')
//@Require('airbugserver.ActionManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
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
var Action                  = bugpack.require('airbugserver.Action');
var ActionManager           = bugpack.require('airbugserver.ActionManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
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

bugyarn.registerWeaver("testAction", function(yarn, args) {
    yarn.spin([
        "setupTestActionManager"
    ]);

    var actionData         = args[0] || {};
    var testActionData     = Obj.merge(actionData, {
        actionData: {},
        actionType: "testActionType",
        actionVersion: "testActionVersion",
        occurredAt: new Date(Date.now()),
        userId: "testUserId"
    });
    return this.actionManager.generateAction(testActionData);
});

bugyarn.registerWinder("setupTestActionManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        actionManager: new ActionManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.actionManager.setEntityType("Action");
});


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupActionManager = function(setupObject) {
    setupObject.schemaManager.processModule();
    setupObject.mongoDataStore.processModule();
};

var initializeManagers = function(setupObject, callback) {
    $series([
        $task(function(flow) {
            setupObject.actionManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};

var setupActionEntity = function(yarn, setupObject, callback) {
    setupObject.testAction = yarn.weave("testAction");
    $series([
        $task(function(flow) {
            setupObject.actionManager.createAction(setupObject.testAction, function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var actionManagerInstantiationTest = {

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
        this.testActionManager   = new ActionManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testActionManager, ActionManager),
            "Assert instance of ActionManager");
        test.assertEqual(this.testActionManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testActionManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testActionManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testActionManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};

var actionManagerRetrieveActionTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestActionManager"
        ]);
        setupActionManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupActionEntity(yarn, _this, function(throwable) {
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
            _this.actionManager.retrieveAction(_this.testAction.getId(), function(throwable, action) {
                if (!throwable) {
                    test.assertEqual(action.getId(), _this.testAction.getId(),
                        "retrievedAction should return proper entity object");
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

bugmeta.annotate(actionManagerInstantiationTest).with(
    test().name("ActionManager - instantiation test")
);

bugmeta.annotate(actionManagerRetrieveActionTest).with(
    test().name("ActionManager - #retrieveAction Test")
);
