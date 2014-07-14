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
//@Require('airbugserver.Conversation')
//@Require('airbugserver.ConversationManager')
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

    var Class                   = bugpack.require('Class');
    var Flows                   = bugpack.require('Flows');
    var Conversation            = bugpack.require('airbugserver.Conversation');
    var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestConversationManager", function(yarn) {
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        yarn.wind({
            conversationManager: new ConversationManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
        });
        this.conversationManager.setEntityType("Conversation");
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var conversationManagerInstantiationTest = {

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
            this.testConversationManager   = new ConversationManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testConversationManager, ConversationManager),
                "Assert instance of ConversationManager");
            test.assertEqual(this.testConversationManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
            test.assertEqual(this.testConversationManager.getEntityDataStore(), this.mongoDataStore,
                "Assert .entityDataStore was set correctly");
            test.assertEqual(this.testConversationManager.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testConversationManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
                "Assert .entityDeltaBuilder was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(conversationManagerInstantiationTest).with(
        test().name("ConversationManager - instantiation test")
    );
});
