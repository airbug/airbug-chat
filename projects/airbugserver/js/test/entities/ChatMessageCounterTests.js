//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.ChatMessageCounter')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var ChatMessageCounter      = bugpack.require('airbugserver.ChatMessageCounter');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var chatMessageCounterBasicsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId                 = 'testId';
        this.testConversationId     = "testConversationId";
        this.testCount              = 10;
        this.testChatMessageCounter = new ChatMessageCounter({
            id:                     this.testId,
            conversationId:         this.testConversationId,
            count:                  this.testCount
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testChatMessageCounter.getId(), this.testId,
            'ChatMessageCounter id was set correctly');
        test.assertEqual(this.testChatMessageCounter.getConversationId(), this.testConversationId,
            'ChatMessageCounter conversationId was set correctly');
        test.assertEqual(this.testChatMessageCounter.getCount(), this.testCount,
            'ChatMessageCounter count was set correctly');
    }
};
bugmeta.annotate(chatMessageCounterBasicsTest).with(
    test().name('ChatMessageCounter - instantiation and getter Test')
);
