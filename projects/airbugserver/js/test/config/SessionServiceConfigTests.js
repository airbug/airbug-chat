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
//@Require('airbugserver.SessionServiceConfig')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
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
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


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
bugmeta.tag(sessionServiceConfigInstantiationEmptyDataTest).with(
    test().name("SessionServiceConfig - instantiation with empty data test")
);
