//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserService')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Session             = bugpack.require('airbugserver.Session');
var User                = bugpack.require('airbugserver.User');
var UserService         = bugpack.require('airbugserver.UserService');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger              = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


// Setup Methods
//-------------------------------------------------------------------------------

var setupUserServiceWitExistingUsers = function(setupObject) {
    setupObject.existingUser = new User({
        id: "testId",
        email: 'test@example.com',
        passwordHash: '$2a$10$UCNxW7UFww9z97eijL8QhewpxjqNCjv0CoPO/PKOyjdnMdoRSnlMe'
    });
    var dummyUserManagerExistingUser = {
        retrieveUserByEmail: function(email, callback) {
            if (email === "test@example.com") {
                callback(undefined, setupObject.existingUser);
            } else {
                callback(undefined, undefined);
            }
        }
    };
    setupUserService(setupObject, dummyUserManagerExistingUser);
};

var setupUserServiceWitNoUsers = function(setupObject) {
    var dummyUserManager = {
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
    setupUserService(setupObject, dummyUserManager);
};

var setupUserService = function(setupObject, userManager) {
    setupObject.logger              = new Logger();
    setupObject.testCurrentUser     = new User({});
    setupObject.testSession         = new Session({});
    setupObject.dummyUserManager    = userManager;
    setupObject.testRequestContext  = {
        get: function(key) {
            if (key === "currentUser") {
                return setupObject.testCurrentUser;
            } else if (key === "session") {
                return setupObject.testSession;
            }
            return undefined;
        },
        set: function(key, value) {

        }
    };
    setupObject.testMeldManager     = {
        commitTransaction: function(callback) {
            callback();
        }
    };
    setupObject.testMeldKey         = {};
    setupObject.dummyMeldService    = {
        factoryManager: function() {
            return setupObject.testMeldManager;
        },
        generateMeldKey: function() {
            return setupObject.testMeldKey;
        },
        meldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
        },
        unmeldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
        },
        pushEntity: function(meldManager, type, filter, entity) {

        },
        unpushEntity: function(meldManager, type, filter, entity) {

        }
    };
    setupObject.sessionService      = {
        regenerateSession: function(session, callback) {
            callback(undefined, setupObject.testSession);
        }
    };
    setupObject.dummySessionManager = {
        updateSession: function(session, callback) {
            callback();
        }
    };
    setupObject.testUserService     = new UserService(setupObject.dummySessionManager, setupObject.dummyUserManager,
        setupObject.dummyMeldService, setupObject.sessionService);
    setupObject.testUserService.logger = setupObject.logger;
};


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

var userServiceRegisterUserWitNonExistingEmailTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitNoUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // Test with a user that doesn't exist yet.
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "testPassword",
                    confirmPassword: "testPassword"
                };
                _this.testUserService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    console.log("this.testUserServiceNoUsers.registerUser throwable", throwable);
                    test.assertTrue(throwable === null,
                        "Make sure that throwable was not defined");
                    test.assertTrue(!!user,
                        "Assert user was generated");
                    test.assertEqual(user.getEmail(), "test@example.com",
                        "Assert that email was set properly");
                    test.assertTrue(user.getPasswordHash() !== undefined,
                        "Assert that password hash was generated");
                    test.assertTrue(user.getPasswordHash().length > 0,
                        "Assert that the hash was generated");
                    flow.complete(throwable);
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

var userServiceRegisterUserWithEmptyPasswordTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitNoUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // Test with specifying an empty password
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "",
                    confirmPassword: ""
                };
                _this.testUserService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because no password was specified");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertTrue(Class.doesExtend(throwable, Exception),
                        "Assert that the throwable extends Exception");
                    test.assertEqual(throwable.getType(), "InvalidPassword",
                        "Assert that the user was not created because the password was invalid");
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

var userServiceRegisterUserWithMismatchingPasswordsTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitNoUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // Test register with mismatching passwords
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "password1",
                    confirmPassword: "password2"
                };
                _this.testUserService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because passwords don't match");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertTrue(Class.doesExtend(throwable, Exception),
                        "Assert that throwable extends Exception");
                    test.assertEqual(throwable.getType(), "PasswordMismatch",
                        "Assert that the user was not created because the passwords didn't match");
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

var userServiceRegisterUserWithExistingEmailTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitExistingUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // Test with a user that already exists
                var formData = {
                    email: "test@example.com",
                    firstName: "",
                    lastName: "",
                    password: "testPassword",
                    confirmPassword: "testPassword"
                };
                _this.testUserService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because it already existed");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertEqual(throwable.getType(), "UserExists",
                        "Assert that the user was not created because it already existed");
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

var userServiceLoginWithValidEmailAndPasswordTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitExistingUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // test login with a valid user and password
                var email = "test@example.com";
                var password = "lastpass";
                _this.testUserService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(throwable === null,
                        "Make sure that throwable was null");
                    test.assertTrue(!!user,
                        "Assert user was loaded");
                    test.assertEqual(user.getEmail(), "test@example.com",
                        "Assert that email was the user we expected");
                    flow.complete(throwable);
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

var userServiceLoginWithValidEmailAndBlankPasswordTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitExistingUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // test login with a valid user and blank password
                var email = "test@example.com";
                var password = "";
                _this.testUserService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because login failed");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertTrue(Class.doesExtend(throwable, Exception),
                        "Assert that service returned an Exception and not an Error");
                    test.assertEqual(throwable.getType(), "InvalidPassword",
                        "Assert that the user was not loaded because the password was Invalid");
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


var userServiceLoginWithEmailThatDoesNotExistTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitExistingUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // test login with a user that doesn't exist
                var email = "test@plagzample.com";
                var password = "what???";
                _this.testUserService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because login failed");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertTrue(Class.doesExtend(throwable, Exception),
                        "Assert that throwable extends Exception");
                    test.assertEqual(throwable.getType(), "NotFound",
                        "Assert that the user was not loaded because it was not found");
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

var userServiceLoginWithValidEmailButWrongPasswordTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserServiceWitExistingUsers(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                // test login with a valid user but wrong password
                var email = "test@example.com";
                var password = "what???";
                _this.testUserService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
                    test.assertTrue(user === undefined,
                        "Assert user was not generated because login failed");
                    test.assertTrue(!!throwable,
                        "Make sure that throwable was defined");
                    test.assertTrue(Class.doesExtend(throwable, Exception),
                        "Assert that throwable extends Exception");
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

bugmeta.annotate(userServiceRegisterUserWitNonExistingEmailTest).with(
    test().name("UserService - register user with non-existing email test")
);

bugmeta.annotate(userServiceRegisterUserWithEmptyPasswordTest).with(
    test().name("UserService - register user with empty password test")
);

bugmeta.annotate(userServiceRegisterUserWithMismatchingPasswordsTest).with(
    test().name("UserService - register user with mismatching passwords test")
);

bugmeta.annotate(userServiceRegisterUserWithExistingEmailTest).with(
    test().name("UserService - register user with existing email test")
);

bugmeta.annotate(userServiceLoginWithValidEmailAndPasswordTest).with(
    test().name("UserService - login with valid email and password test")
);

bugmeta.annotate(userServiceLoginWithValidEmailAndBlankPasswordTest).with(
    test().name("UserService - login with valid email and blank password test")
);

bugmeta.annotate(userServiceLoginWithEmailThatDoesNotExistTest).with(
    test().name("UserService - login with email that does not exist test")
);

bugmeta.annotate(userServiceLoginWithValidEmailButWrongPasswordTest).with(
    test().name("UserService - login with valid email but wrong password test")
);
