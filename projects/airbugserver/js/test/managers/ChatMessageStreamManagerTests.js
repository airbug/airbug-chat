//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.ChatMessageStreamManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ChatMessageStreamManager        = bugpack.require('airbugserver.ChatMessageStreamManager');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit.TestAnnotation');
var BugYarn                         = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var bugyarn                         = BugYarn.context();
var test                            = TestAnnotation.test;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestChatMessageStreamManager", function(yarn) {
    yarn.wind({
        chatMessageStreamManager: new ChatMessageStreamManager()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var chatMessageStreamManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testChatMessageStreamManager   = new ChatMessageStreamManager();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testChatMessageStreamManager, ChatMessageStreamManager),
            "Assert instance of ChatMessageStreamManager");
    }
};
bugmeta.annotate(chatMessageStreamManagerInstantiationTest).with(
    test().name("ChatMessageStreamManager - instantiation test")
);
