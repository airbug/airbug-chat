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
//@Require('airbugserver.AirbugServerConfig')
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
    var AirbugServerConfig  = bugpack.require('airbugserver.AirbugServerConfig');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestAirbugServerConfig", function(yarn) {
        yarn.wind({
            airbugServerConfig: new AirbugServerConfig({
                appVersion: "testAppVersion",
                github: {
                    clientId: "testGithubClientId",
                    clientSecret: "testGithubClientSecret"
                },
                staticUrl: "testStaticUrl",
                getStickyStaticUrl: "testStickyStaticUrl"
            })
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var airbugServerConfigInstantiationEmptyDataTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testConfigData             = {};
            this.testAirbugServerConfig   = new AirbugServerConfig(this.testConfigData);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testAirbugServerConfig, AirbugServerConfig),
                "Assert instance of AirbugServerConfig");
        }
    };
    bugmeta.tag(airbugServerConfigInstantiationEmptyDataTest).with(
        test().name("AirbugServerConfig - instantiation with empty data test")
    );
});
