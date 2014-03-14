//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.InteractionStatusManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var InteractionStatusManager         = bugpack.require('airbugserver.InteractionStatusManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


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
bugmeta.annotate(interactionStatusManagerInstantiationTest).with(
    test().name("InteractionStatusManager - instantiation test")
);
