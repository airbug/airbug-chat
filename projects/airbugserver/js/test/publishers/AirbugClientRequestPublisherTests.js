//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.AirbugClientRequestPublisher')
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
    var AirbugClientRequestPublisher    = bugpack.require('airbugserver.AirbugClientRequestPublisher');
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

    bugyarn.registerWinder("setupTestAirbugClientRequestPublisher", function(yarn) {
        yarn.spin([
            "setupTestLogger",
            "setupTestCallManager",
            "setupTestCallRequestManager",
            "setupTestCallRequestFactory",
            "setupTestCallResponseHandlerFactory",
            "setupTestPubSub",
            "setupTestAirbugCallManager"
        ]);
        yarn.wind({
            airbugClientRequestPublisher: new AirbugClientRequestPublisher(this.logger, this.callManager, this.callRequestManager, this.callRequestFactory, this.callResponseHandlerFactory, this.pubSub, this.airbugCallManager)
        });
    });


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    var airbugClientRequestPublisherInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger",
                "setupTestCallManager",
                "setupTestCallRequestManager",
                "setupTestCallRequestFactory",
                "setupTestCallResponseHandlerFactory",
                "setupTestPubSub",
                "setupTestAirbugCallManager"
            ]);
            this.testAirbugClientRequestPublisher   = new AirbugClientRequestPublisher(this.logger, this.callManager, this.callRequestManager, this.callRequestFactory, this.callResponseHandlerFactory, this.pubSub, this.airbugCallManager);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testAirbugClientRequestPublisher, AirbugClientRequestPublisher),
                "Assert instance of AirbugClientRequestPublisher");
            test.assertEqual(this.testAirbugClientRequestPublisher.getAirbugCallManager(), this.airbugCallManager,
                "Assert .airbugCallManager was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getCallManager(), this.callManager,
                "Assert .callManager was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getCallRequestFactory(), this.callRequestFactory,
                "Assert .callRequestFactory was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getCallRequestManager(), this.callRequestManager,
                "Assert .callRequestManager was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getCallResponseHandlerFactory(), this.callResponseHandlerFactory,
                "Assert .callResponseHandlerFactory was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testAirbugClientRequestPublisher.getPubSub(), this.pubSub,
                "Assert .pubSub was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(airbugClientRequestPublisherInstantiationTest).with(
        test().name("AirbugClientRequestPublisher - instantiation test")
    );
});
