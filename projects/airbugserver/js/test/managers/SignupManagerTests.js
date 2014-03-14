//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Signup')
//@Require('airbugserver.SignupManager')
//@Require('bugflow.BugFlow')
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
var Obj                     = bugpack.require('Obj');
var Signup                 = bugpack.require('airbugserver.Signup');
var SignupManager          = bugpack.require('airbugserver.SignupManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testSignup", function(yarn, args) {
    yarn.spin([
        "setupTestSignupManager"
    ]);

    var signupData         = args[0] || {};
    var testSignupData     = Obj.merge(signupData, {
        acceptedLanguages: "testAcceptedLanguages",
        airbugVersion: "testAirbugVersion",
        baseBetaKey: "testBaseBetKey",
        betaKey: "testBetaKey",
        city: "testCity",
        country: "testCountry",
        createdAt: new Date(Date.now()),
        day: 1,
        geoCoordinates: [1,1],
        ipAddress: "127.0.01",
        languages: ["testLanguage"],
        month: 1,
        secondaryBetaKeys: ["testSecondaryBetaKey"],
        state: "testState",
        updatedAt: new Date(Date.now()),
        userAgent: "testUserAgent",
        userId: "testUserId",
        version: "testVersion",
        number: "testNumber",
        weekday: 1,
        year: 1
    });
    return this.signupManager.generateSignup(testSignupData);
});

bugyarn.registerWinder("setupTestSignupManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        signupManager: new SignupManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.signupManager.setEntityType("Signup");
});


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupSignupManager = function(setupObject) {
    setupObject.schemaManager.processModule();
    setupObject.mongoDataStore.processModule();
};

var initializeManagers = function(setupObject, callback) {
    $series([
        $task(function(flow) {
            setupObject.signupManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};

var setupSignupEntity = function(yarn, setupObject, callback) {
    setupObject.testSignup = yarn.weave("testSignup");
    $series([
        $task(function(flow) {
            setupObject.signupManager.createSignup(setupObject.testSignup, function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var signupManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        this.testSignupManager   = new SignupManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSignupManager, SignupManager),
            "Assert instance of SignupManager");
        test.assertEqual(this.testSignupManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testSignupManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testSignupManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testSignupManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};

var signupManagerRetrieveSignupTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSignupManager"
        ]);
        setupSignupManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupSignupEntity(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $task(function(flow) {
            _this.signupManager.retrieveSignup(_this.testSignup.getId(), function(throwable, signup) {
                if (!throwable) {
                    test.assertEqual(signup.getId(), _this.testSignup.getId(),
                        "retrievedSignup should return proper entity object");
                }
                flow.complete(throwable);
            });
    }).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(signupManagerInstantiationTest).with(
    test().name("SignupManager - instantiation test")
);

bugmeta.annotate(signupManagerRetrieveSignupTest).with(
    test().name("SignupManager - #retrieveSignupBySignup Test")
);