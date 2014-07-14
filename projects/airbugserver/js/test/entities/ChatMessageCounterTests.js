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

//@Require('UuidGenerator')
//@Require('airbugserver.ChatMessageCounter')
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
var ChatMessageCounter      = bugpack.require('airbugserver.ChatMessageCounter');
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
bugmeta.tag(chatMessageCounterBasicsTest).with(
    test().name('ChatMessageCounter - instantiation and getter Test')
);
