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
//@Require('airbugserver.CookieParser')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var cookie                  = require('cookie');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CookieParser            = bugpack.require('airbugserver.CookieParser');
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

bugyarn.registerWinder("setupTestCookieParser", function(yarn) {
    yarn.wind({
        cookie: cookie,
        cookieParser: new CookieParser(cookie)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var cookieParserInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCookieModule       = {};
        this.testCookieParser       = new CookieParser(this.testCookieModule);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCookieParser, CookieParser),
            "Assert instance of CookieParser");
        test.assertEqual(this.testCookieParser.getCookieModule(), this.testCookieModule,
            "Assert .cookieModule was set correctly");
    }
};
bugmeta.tag(cookieParserInstantiationTest).with(
    test().name("CookieParser - instantiation test")
);
