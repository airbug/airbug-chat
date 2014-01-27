//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var DummyMongoDataStore     = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

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
//        test.assertEqual(this.testChatMessage.getSenderUserId(), this.testSenderUserId,
//            'ChatMessage senderUserId was set correctly');
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