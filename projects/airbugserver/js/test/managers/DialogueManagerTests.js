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
//@Require('airbugserver.Dialogue')
//@Require('airbugserver.DialogueManager')
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

    var Class               = bugpack.require('Class');
    var Flows               = bugpack.require('Flows');
    var Dialogue            = bugpack.require('airbugserver.Dialogue');
    var DialogueManager     = bugpack.require('airbugserver.DialogueManager');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestDialogueManager", function(yarn) {
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        yarn.wind({
            dialogueManager: new DialogueManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
        });
        this.dialogueManager.setEntityType("Dialogue");
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var dialogueManagerInstantiationTest = {

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
            this.testDialogueManager   = new DialogueManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testDialogueManager, DialogueManager),
                "Assert instance of DialogueManager");
            test.assertEqual(this.testDialogueManager.getEntityManagerStore(), this.entityManagerStore,
                "Assert .entityManagerStore was set correctly");
            test.assertEqual(this.testDialogueManager.getEntityDataStore(), this.mongoDataStore,
                "Assert .entityDataStore was set correctly");
            test.assertEqual(this.testDialogueManager.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testDialogueManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
                "Assert .entityDeltaBuilder was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(dialogueManagerInstantiationTest).with(
        test().name("DialogueManager - instantiation test")
    );
});
