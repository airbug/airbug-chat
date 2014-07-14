//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.AirbugCallManager')
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
    var AirbugCallManager       = bugpack.require('airbugserver.AirbugCallManager');
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

    bugyarn.registerWinder("setupTestAirbugCallManager", function(yarn) {
        yarn.spin([
            "setupDummyRedisClient"
        ]);
        yarn.wind({
            airbugCallManager: new AirbugCallManager(this.testRedisClient)
        });
    });


    //-------------------------------------------------------------------------------
    // Tests
    //-------------------------------------------------------------------------------

    var airbugCallManagerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyRedisClient"
            ]);
            this.testAirbugCallManager  = new AirbugCallManager(this.redisClient);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testAirbugCallManager, AirbugCallManager),
                "Assert instance of AirbugCallManager");
            test.assertEqual(this.testAirbugCallManager.getRedisClient(), this.redisClient,
                "Assert .redisClient was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(airbugCallManagerInstantiationTest).with(
        test().name("AirbugCallManager - instantiation test")
    );
});
