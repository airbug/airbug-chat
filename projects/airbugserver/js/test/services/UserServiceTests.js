//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserService')
//@Require('bugflow.BugFlow')
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
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


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

userServicePasswordTests = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.existingUser = new User({
            id: "testId",
            email: 'test@example.com',
            passwordHash: '$2a$10$UCNxW7UFww9z97eijL8QhewpxjqNCjv0CoPO/PKOyjdnMdoRSnlMe'
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
            createUser: function(user, callback) {
                callback();
            }
        };
        this.dummyUserManagerExistingUser = {
            retrieveUserByEmail: function(email, callback) {
                if (email === "test@example.com") {
                    callback(undefined, _this.existingUser);
                } else {
                    callback(undefined, undefined);
                }
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
            },
            set: function(key, value) {

            }
        };
        this.testMeldManager = {
            commitTransaction: function(callback) {
                callback();
            }
        };
        this.testMeldKey = {};
        this.dummyMeldService = {
            factoryManager: function() {
                return _this.testMeldManager;
            },
            generateMeldKey: function() {
                return _this.testMeldKey;
            },
            meldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
            },
            unmeldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
            },
            unmeldEntity: function(meldManager, type, filter, entity) {

            }
        };
        this.sessionService = {
            regenerateSession: function(session, callback) {
                callback(undefined, _this.testSession);
            }
        };
        this.dummySessionManager = {
            updateSession: function(session, callback) {
                callback();
            }
        };
        this.testUserServiceNoUsers = new UserService(this.dummySessionManager, this.dummyUserManager,
            this.dummyMeldService, this.sessionService);
        this.testUserServiceExistingUser = new UserService(this.dummySessionManager,
            this.dummyUserManagerExistingUser, this.dummyMeldService, this.sessionService);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                console.log("test!!!");
                // Test with a user that doesn't exist yet.
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "testPassword",
                    confirmPassword: "testPassword"
                };
                _this.testUserServiceNoUsers.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    console.log("this.testUserServiceNoUsers.registerUser throwable", throwable);
                    test.assertTrue(throwable === undefined,
                        "Make sure that throwable was not defined");
                    test.assertTrue(user !== undefined, "Assert user was generated");
                    test.assertEqual(user.getEmail(), "test@example.com",
                        "Assert that email was set properly");
                    test.assertTrue(user.getPasswordHash() !== undefined,
                        "Assert that password hash was generated");
                    test.assertTrue(user.getPasswordHash().length > 0,
                        "Assert that the hash was generated");
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                // Test with a user that already exists
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "testPassword",
                    confirmPassword: "testPassword"
                };
                _this.testUserServiceExistingUser.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because it already existed");
                    test.assertTrue(throwable !== undefined,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "UserExists",
                        "Assert that the user was not created because it already existed");
                    flow.complete();
                });
            }),
            $task(function(flow) {
                // Test with specifying an empty password
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "",
                    confirmPassword: ""
                };
                _this.testUserServiceNoUsers.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because no password was specified");
                    test.assertTrue(throwable !== undefined,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "InvalidPassword",
                        "Assert that the user was not created because the password was invalid");
                    flow.complete();
                });
            }),
            $task(function(flow) {
                // Test register with mismatching passwords
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "password1",
                    confirmPassword: "password2"
                };
                _this.testUserServiceNoUsers.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because passwords don't match");
                    test.assertTrue(throwable !== undefined,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "PasswordMismatch",
                        "Assert that the user was not created because the passwords didn't match");
                    flow.complete();
                });
            }),
            $task(function(flow) {
                // test login with a valid user and password
                var email = "test@example.com";
                var password = "lastpass";
                _this.testUserServiceExistingUser.loginUser(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(throwable === undefined,
                        "Make sure that throwable was not defined");
                    test.assertTrue(user !== undefined,
                        "Assert user was loaded");
                    test.assertEqual(user.getEmail(), "test@example.com",
                        "Assert that email was the user we expected");
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                // test login with a user that doesn't exist
                var email = "test@plagzample.com";
                var password = "what???";
                _this.testUserServiceExistingUser.loginUser(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because login failed");
                    test.assertTrue(throwable !== undefined,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "NotFound",
                        "Assert that the user was not loaded because it was not found");
                    flow.complete();
                });
            }),
            $task(function(flow) {
                // test login with a valid user but wrong password
                var email = "test@example.com";
                var password = "what???";
                _this.testUserServiceExistingUser.loginUser(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because login failed");
                    test.assertTrue(throwable !== undefined,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "InvalidPassword",
                        "Assert that the user was not loaded because the password was invalid");
                    flow.complete();
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.complete();
            } else {
                test.error(throwable);
            }
        });
    }
};

bugmeta.annotate(userServiceMeldCurrentUserWithCurrentUserTest).with(
    test().name("UserService #meldCurrentUserWithCurrentUser Test")
);

bugmeta.annotate(userServicePasswordTests).with(
    test().name("UserService password Tests")
);
