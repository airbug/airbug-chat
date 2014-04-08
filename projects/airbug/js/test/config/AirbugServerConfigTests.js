//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbug.AirbugServerConfig')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AirbugServerConfig      = bugpack.require('airbug.AirbugServerConfig');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


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
bugmeta.annotate(airbugServerConfigInstantiationEmptyDataTest).with(
    test().name("AirbugServerConfig - instantiation with empty data test")
);
