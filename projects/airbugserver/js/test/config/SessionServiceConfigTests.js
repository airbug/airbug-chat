//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.SessionServiceConfig')
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
var SessionServiceConfig    = bugpack.require('airbugserver.SessionServiceConfig');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
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

bugyarn.registerWeaver("testSessionServiceConfig", function(yarn, args) {
    return new SessionServiceConfig(args[0]);
});

bugyarn.registerWinder("setupTestSessionServiceConfig", function(yarn) {
    yarn.wind({
        sessionServiceConfig: new SessionServiceConfig({
            cookieDomain: "localhost",
            cookieSecret: "some secret, seriously don't tell"
        })
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var sessionServiceConfigInstantiationEmptyDataTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testConfigData             = {};
        this.testSessionServiceConfig   = new SessionServiceConfig(this.testConfigData);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSessionServiceConfig, SessionServiceConfig),
            "Assert instance of SessionServiceConfig");
        test.assertEqual(this.testSessionServiceConfig.getCookieMaxAge(), 86400000,
            "Assert #getCookieMaxAge returns 86400000 by default");
        test.assertEqual(this.testSessionServiceConfig.getCookiePath(), "/",
            "Assert #getCookiePath '/' by default");
        test.assertEqual(this.testSessionServiceConfig.getCookieSecret(), "",
            "Assert #getCookieSecret '' by default");
        test.assertEqual(this.testSessionServiceConfig.getRollingSessions(), false,
            "Assert #getRollingSessions false by default");
        test.assertEqual(this.testSessionServiceConfig.getSessionKey(), "airbug.sid",
            "Assert #getSessionKey 'airbug.sid' by default");
        test.assertEqual(this.testSessionServiceConfig.getTrustProxy(), false,
            "Assert #getTrustProxy false by default");
    }
};
bugmeta.annotate(sessionServiceConfigInstantiationEmptyDataTest).with(
    test().name("SessionServiceConfig - instantiation with empty data test")
);
