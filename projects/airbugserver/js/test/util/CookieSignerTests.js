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
//@Require('airbugserver.CookieSigner')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var cookie_signature        = require('cookie-signature');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CookieSigner            = bugpack.require('airbugserver.CookieSigner');
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

bugyarn.registerWinder("setupTestCookieSignature", function(yarn) {
    yarn.wind({
        cookieSignature: cookie_signature
    });
});

bugyarn.registerWinder("setupTestCookieSigner", function(yarn) {
    yarn.spin([
        "setupTestCookieSignature",
        "setupTestSessionServiceConfig"
    ]);
    yarn.wind({
        cookieSigner: new CookieSigner(this.cookieSignature, this.sessionServiceConfig)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var cookieSignerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testConfig                 = {};
        this.testCookieSignatureModule  = {};
        this.testCookieSigner           = new CookieSigner(this.testCookieSignatureModule, this.testConfig);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCookieSigner, CookieSigner),
            "Assert instance of CookieSigner");
        test.assertEqual(this.testCookieSigner.getCookieSignatureModule(), this.testCookieSignatureModule,
            "Assert .cookieSignatureModule was set correctly");
        test.assertEqual(this.testCookieSigner.getConfig(), this.testConfig,
            "Assert .config was set correctly");
    }
};
bugmeta.tag(cookieSignerInstantiationTest).with(
    test().name("CookieSigner - instantiation test")
);
