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

//@Require('Class')
//@Require('Flows')
//@Require('airbugserver.AirbugCallManager')
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

    var Class               = bugpack.require('Class');
    var Flows               = bugpack.require('Flows');
    var AirbugCallManager   = bugpack.require('airbugserver.AirbugCallManager');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


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
