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

//@Require('UuidGenerator')
//@Require('airbugserver.User')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var User                    = bugpack.require('airbugserver.User');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var userInstantiationTests = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    // testPasswordHash will validate against password 'lastpass' no quotes.
    setup: function(test) {
        this.testAnonymous = true;
        this.testPasswordHash = "$2a$10$UCNxW7UFww9z97eijL8QhewpxjqNCjv0CoPO/PKOyjdnMdoRSnlMe";
        this.testUser = new User({
            anonymous: this.testAnonymous,
            passwordHash: this.testPasswordHash
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testUser.getAnonymous(), this.testAnonymous,
            "Assert User.anonymous was set correctly");
        test.assertEqual(this.testUser.getPasswordHash(), this.testPasswordHash,
            "Assert User.passwordHash was set correctly");
    }
};

var userGetterSetterTests = {
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testUser = new User({});
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testUser.setAnonymous(true);
        test.assertEqual(this.testUser.getAnonymous(), true,
            "Assert User.setAnonymous works correctly when set to true");
        test.assertTrue(this.testUser.isAnonymous(),
            "Assert User.isAnonymous works correctly when set to true");
        test.assertTrue(!this.testUser.isNotAnonymous(),
            "Assert User.isNotAnonymous works correctly when set to true");

        this.testUser.setAnonymous(false);
        test.assertEqual(this.testUser.getAnonymous(), false,
            "Assert User.setAnonymous works correctly when set to false");
        test.assertTrue(!this.testUser.isAnonymous(),
            "Assert User.isAnonymous works correctly when set to false");
        test.assertTrue(this.testUser.isNotAnonymous(),
            "Assert User.isNotAnonymous works correctly when set to false");

        this.testUser.setPasswordHash("testPasswordHash");
        test.assertEqual(this.testUser.getPasswordHash(), "testPasswordHash",
            "Assert User.setPasswordHash works correctly");
    }

};

bugmeta.tag(userInstantiationTests).with(
    test().name("User instantiation Tests")
);
bugmeta.tag(userGetterSetterTests).with(
    test().name("User getter/setter Tests")
);
