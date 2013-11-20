//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserService')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Session             = bugpack.require('airbugserver.Session');
var User                = bugpack.require('airbugserver.User');
var UserService         = bugpack.require('airbugserver.UserService');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var userServiceMeldCurrentUserWithCurrentUserTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        //_constructor: function(sessionManager, userManager, meldService, sessionService)
        var _this = this;
        this.testId = "testId";
        this.testCurrentUser = {
            getId: function() {
                return _this.testId;
            }
        };
        this.testCalled = false;
        this.testMeldManager = {};
        this.testMeldKey = {};
        this.dummyMeldService   = {
            generateMeldKey: function() {
                return _this.testMeldKey;
            },
            meldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
                _this.testCalled = true;
                test.assertEqual(meldManager, _this.testMeldManager,
                    "Assert meldManager is testMeldManager");
                test.assertEqual(currentUser, _this.testCurrentUser,
                    "Assert currentUser is testCurrentUser");
                test.assertEqual(keyArray[0], _this.testMeldKey,
                    "Assert keyArray had testMeldKey");
                test.assertEqual(reason, "currentUser",
                    "Assert reason was currentUser");
            }
        };
        this.testUserService    = new UserService({}, {}, this.dummyMeldService, {});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testUserService.meldCurrentUserWithCurrentUser(this.testMeldManager, this.testCurrentUser);
        test.assertTrue(this.testCalled,
            "Assert test function was called");
    }
};

userServiceRegisterTests = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.existingUser = new User({
            email: "test@example.com"
        });
        this.testCurrentUser = new User({

        });
        this.testSession = new Session({

        });
        this.dummyUserManager = {
            retrieveUserByEmail: function(email, callback) {
                callback();
            },
            generateUser: function(userObject) {
                return new User(userObject);
            },
            createUser: function() {}
        };
        this.dummyUserManagerExistingUser = {
            retrieveUserByEmail: function(email, callback) {
                callback(undefined, _this.existingUser);
            }
        };
        this.testRequestContext = {
            get: function(key) {
                if (key === "currentUser") {
                    return _this.testCurrentUser;
                } else if (key === "session") {
                    return _this.testSession;
                }
                return undefined;
            }
        };
        this.testMeldManager = {
        };
        this.testMeldKey = {};
        this.dummyMeldService   = {
            factoryManager: function() {
                return _this.testMeldManager;
            }
        };
        this.testUserService = new UserService({}, this.dummyUserManager, this.dummyMeldService, {});
        this.testUserServiceExistingUser = new UserService({}, this.dummyUserManagerExistingUser, this.dummyMeldService, {});
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Test with a user that doesn't exist yet.
        var formData = {
            email: "test@example.com",
            firstName: "",
            lastName: "",
            password: "testPassword",
            confirmPassword: "testPassword"
        };
        this.testUserService.registerUser(this.testRequestContext, formData, function(throwable, user) {
            console.log("this.testUserService.registerUser throwable", throwable);
            test.assertTrue(user !== undefined, "Assert user was generated");
            test.assertEqual(user.getEmail(), "test@example.com",
                "Assert that email was set properly");
            test.assertTrue(user.getPasswordHash() !== undefined,
                "Assert that password hash was generated");
            test.assertTrue(user.getPasswordHash().length > 0,
                "Assert that the hash was generated");
        });

        // Test with a user that already exists
        this.testUserServiceExistingUser.registerUser(this.testRequestContext, formData, function(throwable, user) {
            test.assertTrue(user === undefined,
                "Assert user was not generated because it already existed");
            test.assertTrue(throwable !== undefined,
                "Make sure that throwable was defined");
            test.assertEqual(throwable.getType(), "UserExists",
                "Assert that the user was not created because it already existed");
        });

        // Test with specifying an empty password
        formData = {
            email: "test@example.com",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        };
        this.testUserService.registerUser(this.testRequestContext, formData, function(throwable, user) {
            test.assertTrue(user === undefined,
                "Assert user was not generated because no password was specified");
            test.assertTrue(throwable !== undefined,
                "Make sure that throwable was defined");
            test.assertEqual(throwable.getType(), "InvalidPassword",
                "Assert that the user was not created because the password was invalid");
        });

        // Test with specifying mismatching passwords
        formData = {
            email: "test@example.com",
            firstName: "",
            lastName: "",
            password: "password1",
            confirmPassword: "password2"
        };
        this.testUserService.registerUser(this.testRequestContext, formData, function(throwable, user) {
            test.assertTrue(user === undefined,
                "Assert user was not generated because passwords don't match");
            test.assertTrue(throwable !== undefined,
                "Make sure that throwable was defined");
            test.assertEqual(throwable.getType(), "PasswordMismatch",
                "Assert that the user was not created because the passwords didn't match");
        });
    }
};

bugmeta.annotate(userServiceMeldCurrentUserWithCurrentUserTest).with(
    test().name("UserService #meldCurrentUserWithCurrentUser Test")
);

bugmeta.annotate(userServiceRegisterTests).with(
    test().name("UserService #register Test")
);
