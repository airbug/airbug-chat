//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.InteractionStatusManager')
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

    var Class                   = bugpack.require('Class');
    var InteractionStatusManager         = bugpack.require('airbugserver.InteractionStatusManager');
    var Flows                 = bugpack.require('Flows');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag          = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestInteractionStatusManager", function(yarn) {
        yarn.spin([
            "setupTestAirbugCallManager",
            "setupDummyRedisClient"
        ]);
        yarn.wind({
            interactionStatusManager: new InteractionStatusManager(this.airbugCallManager, this.redisClient)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var interactionStatusManagerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestAirbugCallManager",
                "setupDummyRedisClient"
            ]);
            this.testInteractionStatusManager   = new InteractionStatusManager(this.airbugCallManager, this.redisClient);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testInteractionStatusManager, InteractionStatusManager),
                "Assert instance of InteractionStatusManager");
            test.assertEqual(this.testInteractionStatusManager.getAirbugCallManager(), this.airbugCallManager,
                "Assert .airbugCallManager was set correctly");
            test.assertEqual(this.testInteractionStatusManager.getRedisClient(), this.redisClient,
                "Assert .redisClient was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(interactionStatusManagerInstantiationTest).with(
        test().name("InteractionStatusManager - instantiation test")
    );
});
