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
//@Require('airbugserver.Cookie')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionData')
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

var UuidGenerator           = bugpack.require('UuidGenerator');
var Cookie                  = bugpack.require('airbugserver.Cookie');
var Session                 = bugpack.require('airbugserver.Session');
var SessionData             = bugpack.require('airbugserver.SessionData');
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
// Declare Tests
//-------------------------------------------------------------------------------

var sessionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSessionData        = {
            createdAt: new Date(Date.now()),
            cookie: new Cookie({
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            }),
            data: new SessionData({
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            }),
            id: "testId",
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.testSession = new Session(this.testSessionData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testSession.getCookie(), this.testSessionData.cookie,
            "Assert that #getCookie is equal to testSessionData.cookie");
        test.assertEqual(this.testSession.getCreatedAt(), this.testSessionData.createdAt,
            "Assert that #getCreatedAt is equal to testSessionData.createdAt value");
        test.assertEqual(this.testSession.getId(), this.testSessionData.id,
            "Assert that #getId is equal to this.testSessionData.id");
        test.assertEqual(this.testSession.getData(),  this.testSessionData.data,
            "Assert that #getData is equal to testSessionData.data value");
        test.assertEqual(this.testSession.getSid(), this.testSessionData.sid,
            "Assert that #getSid is equal to testSessionData.sid value");
        test.assertEqual(this.testSession.getUpdatedAt(), this.testSessionData.updatedAt,
            "Assert that #getUpdatedAt is equal to testSessionData.updatedAt value");
        test.assertEqual(this.testSession.getUserId(), this.testSessionData.userId,
            "Assert that #getUserId is equal to testSessionData.userId value");
    }
};

var sessionDeepCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSessionData        = {
            createdAt: new Date(Date.now()),
            cookie: new Cookie({
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            }),
            data: new SessionData({
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            }),
            id: "testId",
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.testSession = new Session(this.testSessionData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var clone = this.testSession.clone(true);
        test.assertEqual(clone.getCookie().getDomain(), this.testSessionData.cookie.getDomain(),
            "Assert that #getCookie#getDomain is equal to testSessionData.cookie#getDomain");
        test.assertEqual(clone.getCookie().getExpires(), this.testSessionData.cookie.getExpires(),
            "Assert that #getCookie#getExpires is equal to testSessionData.cookie#getExpires");
        test.assertEqual(clone.getCookie().getHttpOnly(), this.testSessionData.cookie.getHttpOnly(),
            "Assert that #getCookie#getHttpOnly is equal to testSessionData.cookie#getHttpOnly");
        test.assertEqual(clone.getCookie().getPath(), this.testSessionData.cookie.getPath(),
            "Assert that #getCookie#getPath is equal to testSessionData.cookie#getPath");
        test.assertEqual(clone.getCookie().getSecure(), this.testSessionData.cookie.getSecure(),
            "Assert that #getCookie#getSecure is equal to testSessionData.cookie#getSecure");
        test.assertEqual(clone.getCreatedAt(), this.testSessionData.createdAt,
            "Assert that #getCreatedAt is equal to testSessionData#getCreatedAt value");
        test.assertEqual(clone.getId(), this.testSessionData.id,
            "Assert that #getId is equal to this.testSessionData.id");
        test.assertEqual(clone.getData().getGithubAuthToken(),  this.testSessionData.data.getGithubAuthToken(),
            "Assert that #getData#getGithubAuthToken is equal to testSessionData.data#getGithubAuthToken value");
        test.assertEqual(clone.getData().getGithubEmails()[0],  this.testSessionData.data.getGithubEmails()[0],
            "Assert that #getData#getGithubEmails[0] is equal to testSessionData.data#getGithubEmails[0] value");
        test.assertEqual(clone.getData().getGithubId(),  this.testSessionData.data.getGithubId(),
            "Assert that #getData#getGithubId is equal to testSessionData.data#getGithubId value");
        test.assertEqual(clone.getData().getGithubLogin(),  this.testSessionData.data.getGithubLogin(),
            "Assert that #getData#getGithubLogin is equal to testSessionData.data#getGithubLogin value");
        test.assertEqual(clone.getData().getGithubState(),  this.testSessionData.data.getGithubState(),
            "Assert that #getData#getGithubState is equal to testSessionData.data#getGithubState value");
        test.assertEqual(clone.getSid(), this.testSessionData.sid,
            "Assert that #getSid is equal to testSessionData.sid value");
        test.assertEqual(clone.getUserId(), this.testSessionData.userId,
            "Assert that #getUserId is equal to testSessionData.userId value");


        test.assertTrue(clone.getCookie() !== this.testSession.getCookie(),
            "Assert that Cookie instances are not the same");
        test.assertTrue(clone.getData() !== this.testSession.getData(),
            "Assert that SessionData instances are not the same");
    }
};

var sessionMongooseSchemaTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyMongoDataStore"
        ]);
        this.schemaManager.configureModule();
        this.mongoDataStore.configureModule();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var mongooseModel   = this.mongoDataStore.getMongooseModelForName("Session");
        var mongooseSchema  = mongooseModel.schema;

        //TEST
        console.log("BIG TEST: Session mongooseSchema.schemaObject:", mongooseSchema.schemaObject);
        var expectedSchemaObject = {
            cookie: {
                domain: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false,
                    'default': ""
                },
                expires: {
                    index: false,
                    required: true,
                    type: Date,
                    unique: false
                },
                httpOnly: {
                    index: false,
                    required: true,
                    type: Boolean,
                    unique: false
                },
                path: {
                    index: false,
                    required: true,
                    type: String,
                    unique: false
                },
                secure: {
                    index: false,
                    required: true,
                    type: Boolean,
                    unique: false
                }
            },
            createdAt: {
                index: false,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            data: {
                githubAuthToken: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false
                },
                githubEmails: {
                    index: false,
                    type: [Object]
                },
                githubId: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false
                },
                githubLogin: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false
                },
                githubState: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false
                }
            },
            sid: {
                index: true,
                required: true,
                type: String,
                unique: true
            },
            updatedAt: {
                index: false,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            userId: {
                index: true,
                required: false,
                type: this.mongoose.Schema.Types.ObjectId,
                unique: false
            }
        };
        test.assertEqual(JSON.stringify(mongooseSchema.schemaObject), JSON.stringify(expectedSchemaObject),
            "Assert Session mongooseSchema is expected result");
    }
};

var sessionResetMaxAgeTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSessionData        = {
            createdAt: new Date(Date.now()),
            cookie: new Cookie({
                domain: "testDomain",
                expires: new Date(1),
                httpOnly: false,
                path: "testPath",
                secure: false
            }),
            data: new SessionData({
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            }),
            id: "testId",
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.testSession = new Session(this.testSessionData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var oldExpires = this.testSession.getExpires();
        this.testSession.resetMaxAge();
        var newExpires = this.testSession.getExpires();
        test.assertTrue(newExpires > oldExpires,
            "Assert that .expires has been updated and is greater than the old expires");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(sessionInstantiationTest).with(
    test().name("Session - instantiation Test")
);
bugmeta.tag(sessionDeepCloneTest).with(
    test().name("Session - #clone deep Test")
);
bugmeta.tag(sessionMongooseSchemaTest).with(
    test().name("Session - mongoose schema Test")
);
bugmeta.tag(sessionResetMaxAgeTest).with(
    test().name("Session - resetMaxAge Test")
);
