//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Signup')
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

var Signup                 = bugpack.require('airbugserver.Signup');
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
// Declare Tests
//-------------------------------------------------------------------------------

var signupInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSignupData   = {
            acceptedLanguages: "testAcceptedLanguages",
            airbugVersion: "testAirbugVersion",
            baseBetaKey: "testBaseBetaKey",
            betaKey: "testBetaKey",
            city: "testCity",
            country: "testCountry",
            createdAt: new Date(Date.now()),
            day: 1,
            geoCoordinates:[1,1],
            id: "testId",
            ipAddress: "testIpAddress",
            languages:["testLanguage"],
            month: 1,
            secondaryBetaKeys: ["testSecondaryBetaKey"],
            state: "testState",
            updatedAt: new Date(Date.now()),
            userAgent: "testUserAgent",
            userId: "testUserId",
            version: "0.0.1",
            weekday: 1,
            year: 1
        };
        this.testSignup = new Signup(this.testSignupData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testSignup.getAcceptedLanguages(), this.testSignupData.acceptedLanguages,
            "Assert that #getAcceptedLanguages is equal to testSignup.acceptedLanguages");
        test.assertEqual(this.testSignup.getAirbugVersion(), this.testSignupData.airbugVersion,
            "Assert that #getAirbugVersion is equal to testSignupData.airbugVersion value");
        test.assertEqual(this.testSignup.getBaseBetaKey(), this.testSignupData.baseBetaKey,
            "Assert that #getBaseBetaKey is equal to this.testSignupData.baseBetaKey");
        test.assertEqual(this.testSignup.getBetaKey(),  this.testSignupData.betaKey,
            "Assert that #getBetaKey is equal to testSignupData.betaKey value");
        test.assertEqual(this.testSignup.getCity(), this.testSignupData.city,
            "Assert that #getCity is equal to testSignupData.city value");
        test.assertEqual(this.testSignup.getCountry(), this.testSignupData.country,
            "Assert that #getCountry is equal to testSignupData.country value");
        test.assertEqual(this.testSignup.getCreatedAt(), this.testSignupData.createdAt,
            "Assert that #getCreatedAt is equal to testSignupData.createdAt value");
        test.assertEqual(this.testSignup.getDay(), this.testSignupData.day,
            "Assert that #getDay is equal to testSignupData.day value");
        test.assertEqual(this.testSignup.getGeoCoordinates(), this.testSignupData.geoCoordinates,
            "Assert that #getGeoCoordinates is equal to testSignupData.geoCoordinates value");
        test.assertEqual(this.testSignup.getId(), this.testSignupData.id,
            "Assert that #getId is equal to testSignupData.id value");
        test.assertEqual(this.testSignup.getIpAddress(), this.testSignupData.ipAddress,
            "Assert that #getIpAddress is equal to testSignupData.ipAddress value");
        test.assertEqual(this.testSignup.getLanguages(), this.testSignupData.languages,
            "Assert that #getLanguages is equal to testSignupData.languages value");
        test.assertEqual(this.testSignup.getMonth(), this.testSignupData.month,
            "Assert that #getMonth is equal to testSignupData.month value");
        test.assertEqual(this.testSignup.getSecondaryBetaKeys(), this.testSignupData.secondaryBetaKeys,
            "Assert that #getSecondaryBetaKeys is equal to testSignupData.secondaryBetaKeys value");
        test.assertEqual(this.testSignup.getState(), this.testSignupData.state,
            "Assert that #getState is equal to testSignupData.state value");
        test.assertEqual(this.testSignup.getUpdatedAt(), this.testSignupData.updatedAt,
            "Assert that #getUpdatedAt is equal to testSignupData.updatedAt value");
        test.assertEqual(this.testSignup.getUserAgent(), this.testSignupData.userAgent,
            "Assert that #getUserAgent is equal to testSignupData.userAgent value");
        test.assertEqual(this.testSignup.getUserId(), this.testSignupData.userId,
            "Assert that #getUserId is equal to testSignupData.userId value");
        test.assertEqual(this.testSignup.getVersion(), this.testSignupData.version,
            "Assert that #getVersion is equal to testSignupData.version value");
        test.assertEqual(this.testSignup.getWeekday(), this.testSignupData.weekday,
            "Assert that #getWeekday is equal to testSignupData.weekday value");
        test.assertEqual(this.testSignup.getYear(), this.testSignupData.year,
            "Assert that #getYear is equal to testSignupData.year value");
    }
};

var signupDeepCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSignupData   = {
            acceptedLanguages: "testAcceptedLanguages",
            airbugVersion: "testAirbugVersion",
            baseBetaKey: "testBaseBetaKey",
            betaKey: "testBetaKey",
            city: "testCity",
            country: "testCountry",
            createdAt: new Date(Date.now()),
            day: 1,
            geoCoordinates:[1,1],
            id: "testId",
            ipAddress: "testIpAddress",
            languages:["testLanguage"],
            month: 1,
            secondaryBetaKeys: ["testSecondaryBetaKey"],
            state: "testState",
            updatedAt: new Date(Date.now()),
            userAgent: "testUserAgent",
            userId: "testUserId",
            version: "0.0.1",
            weekday: 1,
            year: 1
        };
        this.testSignup = new Signup(this.testSignupData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var clone = this.testSignup.clone(true);
        test.assertEqual(clone.getAcceptedLanguages(), this.testSignup.getAcceptedLanguages(),
            "Assert that #getAcceptedLanguages is equal to testSignup#getAcceptedLanguages");
        test.assertEqual(clone.getAirbugVersion(), this.testSignup.getAirbugVersion(), 
            "Assert that #getAirbugVersion is equal to testSignup#getAirbugVersion");
        test.assertEqual(clone.getBaseBetaKey(), this.testSignup.getBaseBetaKey(), 
            "Assert that #getBaseBetaKey is equal to this.testSignup#getBaseBetaKey");
        test.assertEqual(clone.getBetaKey(), this.testSignup.getBetaKey(),
            "Assert that #getBetaKey is equal to testSignup#getBetaKey value");
        test.assertEqual(clone.getCity(), this.testSignup.getCity(),
            "Assert that #getCity is equal to testSignup#getCity value");
        test.assertEqual(clone.getCountry(), this.testSignup.getCountry(),
            "Assert that #getCountry is equal to testSignup.country value");
        test.assertEqual(clone.getCreatedAt(), this.testSignup.getCreatedAt(),
            "Assert that #getCreatedAt is equal to testSignup#getCreatedAt value");
        test.assertEqual(clone.getDay(), this.testSignup.getDay(),
            "Assert that #getDay is equal to testSignup#getDay value");
        test.assertEqual(clone.getGeoCoordinates()[0], this.testSignup.getGeoCoordinates()[0],
            "Assert that #getGeoCoordinates[0] is equal to testSignup#getGeoCoordinates[0] value");
        test.assertEqual(clone.getId(), this.testSignup.getId(),
            "Assert that #getId is equal to testSignup#getId value");
        test.assertEqual(clone.getIpAddress(), this.testSignup.getIpAddress(),
            "Assert that #getIpAddress is equal to testSignup#getIpAddress value");
        test.assertEqual(clone.getLanguages()[0], this.testSignup.getLanguages()[0],
            "Assert that #getLanguages[0] is equal to testSignup#getLanguages[0] value");
        test.assertEqual(clone.getMonth(), this.testSignup.getMonth(),
            "Assert that #getMonth is equal to testSignup#getMonth value");
        test.assertEqual(clone.getSecondaryBetaKeys()[0], this.testSignup.getSecondaryBetaKeys()[0],
            "Assert that #getSecondaryBetaKeys is equal to testSignup#getSecondaryBetaKeys value");
        test.assertEqual(clone.getState(), this.testSignup.getState(),
            "Assert that #getState is equal to testSignup#getState value");
        test.assertEqual(clone.getUpdatedAt(), this.testSignup.getUpdatedAt(),
            "Assert that #getUpdatedAt is equal to testSignup#getUpdatedAt value");
        test.assertEqual(clone.getUserAgent(), this.testSignup.getUserAgent(),
            "Assert that #getUserAgent is equal to testSignup#getUserAgent value");
        test.assertEqual(clone.getUserId(), this.testSignup.getUserId(),
            "Assert that #getUserId is equal to testSignup#getUserId value");
        test.assertEqual(clone.getVersion(), this.testSignup.getVersion(),
            "Assert that #getVersion is equal to testSignup#getVersion value");
        test.assertEqual(clone.getWeekday(), this.testSignup.getWeekday(),
            "Assert that #getWeekday is equal to testSignup#getWeekday value");
        test.assertEqual(clone.getYear(), this.testSignup.getYear(),
            "Assert that #getYear is equal to testSignup#getYear value");

        test.assertTrue(clone !== this.testSignup,
            "Assert that Signup instances are not the same");
    }
};

var signupMongooseSchemaTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyMongoDataStore"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var mongooseModel   = this.mongoDataStore.getMongooseModelForName("Signup");
        var mongooseSchema  = mongooseModel.schema;

        //TEST
        console.log("BIG TEST: Signup mongooseSchema.schemaObject:", mongooseSchema.schemaObject);
        var expectedSchemaObject = {
            acceptedLanguages: {
                index: false,
                required: false,
                type: String,
                unique: false
            },
            airbugVersion: {
                index: true,
                required: true,
                type: String,
                unique: false
            },
            baseBetaKey: {
                index: true,
                required: false,
                type: String,
                unique: false
            },
            betaKey: {
                index: true,
                required: true,
                type: String,
                unique: false
            },
            city: {
                index: true,
                required: false,
                type: String,
                unique: false
            },
            country: {
                index: true,
                required: false,
                type: String,
                unique: false
            },
            createdAt: {
                index: true,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            day: {
                index: true,
                required: false,
                type: Number,
                unique: false
            },
            geoCoordinates: {
                index: true,
                type: [Number]
            },
            ipAddress: {
                index: false,
                required: false,
                type: String,
                unique: false
            },
            languages: {
                index: true,
                type: [String]
            },
            month: {
                index: true,
                required: false,
                type: Number,
                unique: false
            },
            secondaryBetaKeys: {
                index: true,
                type: [String]
            },
            state: {
                index: true,
                required: false,
                type: String,
                unique: false
            },
            updatedAt: {
                index: true,
                required: true,
                type: Date,
                unique: false,
                'default': Date.now
            },
            userAgent: {
                index: true,
                required: false,
                type: String,
                unique: false
            },
            userId: {
                index: true,
                required: false,
                type: this.mongoose.Schema.Types.ObjectId,
                unique: false
            },
            version: {
                index: true,
                required: true,
                type: String,
                unique: false,
                'default': "0.1.0"
            },
            weekday: {
                index: true,
                required: false,
                type: Number,
                unique: false
            },
            year: {
                index: true,
                required: false,
                type: Number,
                unique: false
            }
        };

        test.assertEqual(JSON.stringify(mongooseSchema.schemaObject), JSON.stringify(expectedSchemaObject),
            "Assert Session mongooseSchema is expected result");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(signupInstantiationTest).with(
    test().name("Signup - instantiation Test")
);
bugmeta.annotate(signupDeepCloneTest).with(
    test().name("Signup - #clone deep Test")
);
bugmeta.annotate(signupMongooseSchemaTest).with(
    test().name("Signup - mongoose schema Test")
);
