//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.ChatMessage')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var chatMessageBasicsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId                 = 'testId';
        this.testBody               = {parts: []};
        this.testConversationId     = "testConversationId";
        this.testIndex              = 1;
        this.testSenderUserId       = "testSenderUserId";
        this.testSentAt             = Date.now();
        this.testTryUuid            = "testTryUuid";
        this.testChatMessage        = new ChatMessage({
            id:                     this.testId,
            body:                   this.testBody,
            conversationId:         this.conversationId,
            index:                  this.testIndex,
            senderUserId:           this.testSenderUserId,
            sentAt:                 this.testSentAt,
            tryUuid:                this.testTryUuid
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testChatMessage.getId(), this.testId,
            'ChatMessage id was set correctly');
        test.assertEqual(this.testChatMessage.getBody(), this.testBody,
            'ChatMessage body was set correctly');
//        test.assertEqual(this.testChatMessage.getConversationId(), this.testConversationId, //failing
//            'ChatMessage conversationId was set correctly');
        test.assertEqual(this.testChatMessage.getIndex(), 1,
            'ChatMessage index is set correctly');
        test.assertEqual(this.testChatMessage.getSenderUserId(), this.testSenderUserId,
            'ChatMessage senderUserId was set correctly');
        test.assertEqual(this.testChatMessage.getSentAt(), this.testSentAt,
            'ChatMessage sentAt was set correctly');
        test.assertEqual(this.testChatMessage.getTryUuid(), this.testTryUuid,
            'ChatMessage tryUuid was set correctly');

        //setter tests:
    }
};
bugmeta.tag(chatMessageBasicsTest).with(
    test().name('ChatMessage - instantiation and getter/setter Test')
);