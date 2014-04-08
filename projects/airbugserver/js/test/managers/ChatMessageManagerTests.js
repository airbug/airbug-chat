//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('airbugserver.ChatMessage')
//@Require('airbugserver.ChatMessageManager')
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
var Set                     = bugpack.require('Set');
var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var ChatMessageManager      = bugpack.require('airbugserver.ChatMessageManager');
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

bugyarn.registerWinder("setupTestChatMessageManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder",
        "setupTestChatMessageCounterManager"
    ]);
    yarn.wind({
        chatMessageManager: new ChatMessageManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder, this.chatMessageCounterManager)
    });
    this.chatMessageManager.setEntityType("ChatMessage");
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var chatMessageManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder",
            "setupTestChatMessageCounterManager"
        ]);
        this.testChatMessageManager   = new ChatMessageManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder, this.chatMessageCounterManager);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testChatMessageManager, ChatMessageManager),
            "Assert instance of ChatMessageManager");
        test.assertEqual(this.testChatMessageManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testChatMessageManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testChatMessageManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testChatMessageManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
        test.assertEqual(this.testChatMessageManager.getChatMessageCounterManager(), this.chatMessageCounterManager,
            "Assert .chatMessageCounterManager was set correctly");
        test.assertEqual(this.testChatMessageManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};
bugmeta.annotate(chatMessageManagerInstantiationTest).with(
    test().name("ChatMessageManager - instantiation test")
);

//var chatMessageManagerAddIndexToConditionUsingIndexAndBatchSizeTest = {
//
//    //-------------------------------------------------------------------------------
//    // Setup Test
//    //-------------------------------------------------------------------------------
//
//    setup: function(test) {
//        this.testIndexOne = -1;
//        this.testBatchSizeOne = 50;
//        this.testIndexTwo = 0;
//        this.testBatchSizeTwo = 50;
//        this.testIndexThree = 10;
//        this.testBatchSizeThree = 50;
//        this.testIndexFour = 55;
//        this.testBatchSizeFour = 50;
//        this.testIndexFive = 99;
//        this.testBatchSizeFive = 50;
//        this.testChatMessageManager = new ChatMessageManager();
//        this.testConditionOne   = this.testChatMessageManager.addIndexToConditionUsingIndexAndBatchSize({}, this.testIndexOne,   this.testBatchSizeOne);
//        this.testConditionTwo   = this.testChatMessageManager.addIndexToConditionUsingIndexAndBatchSize({}, this.testIndexTwo,   this.testBatchSizeTwo);
//        this.testConditionThree = this.testChatMessageManager.addIndexToConditionUsingIndexAndBatchSize({}, this.testIndexThree, this.testBatchSizeThree);
//        this.testConditionFour  = this.testChatMessageManager.addIndexToConditionUsingIndexAndBatchSize({}, this.testIndexFour,  this.testBatchSizeFour);
//        this.testConditionFive  = this.testChatMessageManager.addIndexToConditionUsingIndexAndBatchSize({}, this.testIndexFive,  this.testBatchSizeFive);
//    },
//
//
//    //-------------------------------------------------------------------------------
//    // Run Test
//    //-------------------------------------------------------------------------------
//
//    test: function(test) {
//        // Verify instantiation worked properly and values are available.
//        test.assertEqual(this.testChatMessage.getId(), this.testId,
//            'ChatMessage id was set correctly');
//        test.assertEqual(this.testChatMessage.getBody(), this.testBody,
//            'ChatMessage body was set correctly');
////        test.assertEqual(this.testChatMessage.getConversationId(), this.testConversationId, //failing
////            'ChatMessage conversationId was set correctly');
//        test.assertEqual(this.testChatMessage.getIndex(), 1,
//            'ChatMessage index is set correctly');
//        test.assertEqual(this.testChatMessage.getSenderChatMessageId(), this.testSenderChatMessageId,
//            'ChatMessage senderChatMessageId was set correctly');
//        test.assertEqual(this.testChatMessage.getSentAt(), this.testSentAt,
//            'ChatMessage sentAt was set correctly');
//        test.assertEqual(this.testChatMessage.getTryUuid(), this.testTryUuid,
//            'ChatMessage tryUuid was set correctly');
//
//        //setter tests:
//    }
//};
//bugmeta.annotate(chatMessageManagerAddIndexToConditionUsingIndexAndBatchSizeTest).with(
//    test().name('ChatMessage#addIndexToConditionUsingIndexAndBatchSize Test')
//);