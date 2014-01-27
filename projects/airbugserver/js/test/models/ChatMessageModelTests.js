//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.ChatMessageModel')
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

var ChatMessageModel        = bugpack.require('airbugserver.ChatMessageModel');
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

//var ChatMessageModelGetNextIndexByConversationIdTest = {
//
//    //-------------------------------------------------------------------------------
//    // Setup Test
//    //-------------------------------------------------------------------------------
//
//    setup: function(test) {
//
//    },
//
//
//    //-------------------------------------------------------------------------------
//    // Run Test
//    //-------------------------------------------------------------------------------
//
//    test: function(test) {
//        ChatMessageModel.getNextIndexByConversationId(conversationId, callback);
//    }
//};
//bugmeta.annotate(ChatMessageModelGetNextIndexByConversationIdTest).with(
//    test().name('ChatMessageModel.getNextIndexByConversationId Test')
//);