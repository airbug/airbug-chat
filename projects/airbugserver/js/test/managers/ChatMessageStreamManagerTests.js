//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.ChatMessageStreamManager')
//@Require('Flows')
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

    var Class                           = bugpack.require('Class');
    var ChatMessageStreamManager        = bugpack.require('airbugserver.ChatMessageStreamManager');
    var Flows                         = bugpack.require('Flows');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var TestTag                  = bugpack.require('bugunit.TestTag');
    var BugYarn                         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var bugyarn                         = BugYarn.context();
    var test                            = TestTag.test;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(chatMessageStreamManagerInstantiationTest).with(
        test().name("ChatMessageStreamManager - instantiation test")
    );
});
