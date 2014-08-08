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
//@Require('ObjectUtil')
//@Require('airbugserver.Action')
//@Require('airbugserver.ActionManager')
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
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var Action          = bugpack.require('airbugserver.Action');
    var ActionManager   = bugpack.require('airbugserver.ActionManager');
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

    bugyarn.registerWeaver("testAction", function(yarn, args) {
        yarn.spin([
            "setupTestActionManager"
        ]);

        var actionData         = args[0] || {};
        var testActionData     = ObjectUtil.merge(actionData, {
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
        setupObject.schemaManager.configureModule();
        setupObject.mongoDataStore.configureModule();
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
                "setupTestEntityDeltaBuilder"
            ]);
            this.testActionManager   = new ActionManager(this.entityManagerStore, this.schemaManager, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testActionManager, ActionManager),
                "Assert instance of ActionManager");
            test.assertEqual(this.testActionManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
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

    bugmeta.tag(actionManagerInstantiationTest).with(
        test().name("ActionManager - instantiation test")
    );

    bugmeta.tag(actionManagerRetrieveActionTest).with(
        test().name("ActionManager - #retrieveAction Test")
    );
});
