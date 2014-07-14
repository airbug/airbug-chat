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

//@Require('airbugserver.BetaKey')
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

var BetaKey                 = bugpack.require('airbugserver.BetaKey');
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

var betaKeyInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testBetaKeyData   = {
            baseKey: "testBaseKey",
            betaKey: "testBetaKey",
            cap: 1,
            createdAt: new Date(Date.now()),
            count: 1,
            hasCap: true,
            isBaseKey: true,
            secondaryKeys: [
                "secondaryKey"
            ],
            updatedAt: new Date(Date.now()),
            version: "0.0.2"
        };
        this.testBetaKey = new BetaKey(this.testBetaKeyData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testBetaKey.getBaseKey(), this.testBetaKeyData.baseKey,
            "Assert that #getBaseKey is equal to testBetaKey.cookie");
        test.assertEqual(this.testBetaKey.getBetaKey(), this.testBetaKeyData.betaKey,
            "Assert that #getBetaKey is equal to testBetaKeyData.betaKey value");
        test.assertEqual(this.testBetaKey.getCap(), this.testBetaKeyData.cap,
            "Assert that #getCap is equal to this.testBetaKeyData.cap");
        test.assertEqual(this.testBetaKey.getCreatedAt(),  this.testBetaKeyData.createdAt,
            "Assert that #getCreatedAt is equal to testBetaKeyData.createdAt value");
        test.assertEqual(this.testBetaKey.getCount(), this.testBetaKeyData.count,
            "Assert that #getCount is equal to testBetaKeyData.count value");
        test.assertEqual(this.testBetaKey.getHasCap(), this.testBetaKeyData.hasCap,
            "Assert that #getHasCap is equal to testBetaKeyData.hasCap value");
        test.assertEqual(this.testBetaKey.getIsBaseKey(), this.testBetaKeyData.isBaseKey,
            "Assert that #getIsBaseKey is equal to testBetaKeyData.isBaseKey value");
        test.assertEqual(this.testBetaKey.getSecondaryKeys(), this.testBetaKeyData.secondaryKeys,
            "Assert that #getSecondaryKeys is equal to testBetaKeyData.secondaryKeys value");
        test.assertEqual(this.testBetaKey.getUpdatedAt(), this.testBetaKeyData.updatedAt,
            "Assert that #getUpdatedAt is equal to testBetaKeyData.updatedAt value");
        test.assertEqual(this.testBetaKey.getVersion(), this.testBetaKeyData.version,
            "Assert that #getVersion is equal to testBetaKeyData.version value");
    }
};

var betaKeyDeepCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testBetaKeyData   = {
            baseKey: "testBaseKey",
            betaKey: "testBetaKey",
            cap: 1,
            createdAt: new Date(Date.now()),
            count: 1,
            hasCap: true,
            isBaseKey: true,
            secondaryKeys: [
                "secondaryKey"
            ],
            updatedAt: new Date(Date.now()),
            version: "0.0.2"
        };
        this.testBetaKey = new BetaKey(this.testBetaKeyData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var clone = this.testBetaKey.clone(true);
        test.assertEqual(clone.getBaseKey(), this.testBetaKey.getBaseKey(),
            "Assert that #getBaseKey is equal to testBetaKey#getBaseKey");
        test.assertEqual(clone.getBetaKey(), this.testBetaKey.getBetaKey(),
            "Assert that #getBetaKey is equal to testBetaKey#getBetaKey");
        test.assertEqual(clone.getCap(), this.testBetaKey.getCap(),
            "Assert that #getCap is equal to this.testBetaKey#getCap");
        test.assertEqual(clone.getCreatedAt(), this.testBetaKey.getCreatedAt(),
            "Assert that #getCreatedAt is equal to testBetaKey#getCreatedAt");
        test.assertEqual(clone.getCount(), this.testBetaKey.getCount(),
            "Assert that #getCount is equal to testBetaKey#getCount");
        test.assertEqual(clone.getHasCap(), this.testBetaKey.getHasCap(),
            "Assert that #getHasCap is equal to testBetaKey#getHasCap");
        test.assertEqual(clone.getIsBaseKey(), this.testBetaKey.getIsBaseKey(),
            "Assert that #getIsBaseKey is equal to testBetaKey#getIsBaseKey");
        test.assertEqual(clone.getSecondaryKeys()[0], this.testBetaKey.getSecondaryKeys()[0],
            "Assert that #getSecondaryKeys[0] is equal to testBetaKey#getSecondaryKeys[0] value");
        test.assertEqual(clone.getUpdatedAt(), this.testBetaKey.getUpdatedAt(),
            "Assert that #getUpdatedAt is equal to testBetaKey#getUpdatedAt value");
        test.assertEqual(clone.getVersion(), this.testBetaKey.getVersion(),
            "Assert that #getVersion is equal to testBetaKey#getVersion value");


        test.assertTrue(clone !== this.testBetaKey,
            "Assert that BetaKey instances are not the same");
    }
};

var betaKeyMongooseSchemaTest = {

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
        var mongooseModel   = this.mongoDataStore.getMongooseModelForName("BetaKey");
        var mongooseSchema  = mongooseModel.schema;

        //TEST
        console.log("BIG TEST: BetaKey mongooseSchema.schemaObject:", mongooseSchema.schemaObject);
        var expectedSchemaObject = {
            baseKey: {
                index: true,
                required: true,
                type: String,
                unique: false
            },
            betaKey: {
                index: true,
                required: true,
                type: String,
                unique: true
            },
            cap: {
                index: false,
                required: false,
                type: Number,
                unique: false
            },
            count: {
                index: false,
                required: true,
                type: Number,
                unique: false,
                'default': 0
            },
            createdAt: {
                index: false,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            hasCap: {
                index: false,
                required: true,
                type: Boolean,
                unique: false,
                'default': false
            },
            isBaseKey: {
                index: true,
                required: true,
                type: Boolean,
                unique: false,
                'default': false
            },
            secondaryKeys: {
                index: false,
                type: [String]
            },
            updatedAt: {
                index: false,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            version: {
                index: false,
                required: true,
                type: String,
                unique: false,
                'default': "0.0.1"
            }
        }; 

        test.assertEqual(JSON.stringify(mongooseSchema.schemaObject), JSON.stringify(expectedSchemaObject),
            "Assert Session mongooseSchema is expected result");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(betaKeyInstantiationTest).with(
    test().name("BetaKey - instantiation Test")
);
bugmeta.tag(betaKeyDeepCloneTest).with(
    test().name("BetaKey - #clone deep Test")
);
bugmeta.tag(betaKeyMongooseSchemaTest).with(
    test().name("BetaKey - mongoose schema Test")
);
