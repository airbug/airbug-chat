//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Dialogue')
//@Require('airbugserver.DialogueManager')
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
var Dialogue                = bugpack.require('airbugserver.Dialogue');
var DialogueManager         = bugpack.require('airbugserver.DialogueManager');
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
bugmeta.tag(dialogueManagerInstantiationTest).with(
    test().name("DialogueManager - instantiation test")
);
