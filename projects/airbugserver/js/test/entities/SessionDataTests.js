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
//@Require('UuidGenerator')
//@Require('airbugserver.SessionData')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var UuidGenerator           = bugpack.require('UuidGenerator');
var SessionData             = bugpack.require('airbugserver.SessionData');
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

var sessionDataInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSessionDataData    = {
            githubAuthToken: "testGithubAuthToken",
            githubEmails: [
                "testGithubEmail1"
            ],
            githubId: "testGithubId",
            githubLogin: "testGithubLogin",
            githubState: "testGithubState"
        };
        this.testSessionData = new SessionData(this.testSessionDataData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testSessionData.getGithubAuthToken(),  this.testSessionDataData.githubAuthToken,
            "Assert that #getGithubAuthToken is equal to testSessionDataData.githubAuthToken value");
        test.assertEqual(this.testSessionData.getGithubEmails()[0],  this.testSessionDataData.githubEmails[0],
            "Assert that #getGithubEmails[0] is equal to testSessionDataData.githubEmails[0] value");
        test.assertEqual(this.testSessionData.getGithubId(),  this.testSessionDataData.githubId,
            "Assert that #getGithubId is equal to testSessionDataData.githubId value");
        test.assertEqual(this.testSessionData.getGithubLogin(),  this.testSessionDataData.githubLogin,
            "Assert that #getGithubLogin is equal to testSessionDataData.githubLogin value");
        test.assertEqual(this.testSessionData.getGithubState(),  this.testSessionDataData.githubState,
            "Assert that #getGithubState is equal to testSessionDataData.githubState value");
    }
};

var sessionDataCloneDeepTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSessionDataData    = {
            githubAuthToken: "testGithubAuthToken",
            githubEmails: [
                "testGithubEmail1"
            ],
            githubId: "testGithubId",
            githubLogin: "testGithubLogin",
            githubState: "testGithubState"
        };
        this.testSessionData = new SessionData(this.testSessionDataData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var clone = this.testSessionData.clone(true);
        test.assertEqual(clone.getGithubAuthToken(),  this.testSessionDataData.githubAuthToken,
            "Assert that #getGithubAuthToken is equal to testSessionData.githubAuthToken");
        test.assertEqual(clone.getGithubEmails()[0],  this.testSessionDataData.githubEmails[0],
            "Assert that #githubEmails[0] is equal to testSessionData.githubEmails[0]");
        test.assertEqual(clone.getGithubId(),  this.testSessionDataData.githubId,
            "Assert that #githubId is equal to testSessionData.githubId");
        test.assertEqual(clone.getGithubLogin(),  this.testSessionDataData.githubLogin,
            "Assert that #githubLogin is equal to testSessionData.githubLogin");
        test.assertEqual(clone.getGithubState(),  this.testSessionDataData.githubState,
            "Assert that #githubState is equal to testSessionData.githubState");

        test.assertTrue(Class.doesExtend(clone, SessionData),
            "Assert clone is an instance of SessionData");
        test.assertTrue(clone !== this.testSessionData,
            "Assert that SessionData instances are not the same");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(sessionDataInstantiationTest).with(
    test().name("SessionData - instantiation Test")
);
bugmeta.tag(sessionDataCloneDeepTest).with(
    test().name("SessionData - #clone deep Test")
);
