//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.ConversationManager')
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
var Conversation            = bugpack.require('airbugserver.Conversation');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
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
bugmeta.tag(conversationManagerInstantiationTest).with(
    test().name("ConversationManager - instantiation test")
);
