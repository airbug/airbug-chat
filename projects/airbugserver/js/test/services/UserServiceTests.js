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
//@Require('Exception')
//@Require('Flows')
//@Require('Tracer')
//@Require('airbugserver.UserService')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Flows           = bugpack.require('Flows');
    var Tracer          = bugpack.require('Tracer');
    var UserService     = bugpack.require('airbugserver.UserService');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var Logger          = bugpack.require('loggerbug.Logger');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;
    var $series         = Flows.$series;
    var $task           = Flows.$task;
    var $trace          = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestUserService", function(yarn) {
        yarn.spin([
            "setupMockSuccessPushTaskManager",
            "setupTestLogger",
            "setupTestSessionManager",
            "setupTestUserManager",
            "setupTestSessionService",
            "setupTestAirbugClientRequestPublisher",
            "setupTestGithubManager",
            "setupTestUserPusher",
            "setupTestBetaKeyService",
            "setupTestActionManager",
            "setupTestAirbugServerConfig"
        ]);
        yarn.wind({
            userService: new UserService(this.logger, this.sessionManager, this.userManager, this.sessionService, this.airbugClientRequestPublisher, this.githubManager, this.userPusher, this.betaKeyService, this.actionManager, this.airbugServerConfig)
        });
    });


    // Setup Methods
    //-------------------------------------------------------------------------------

    var setupUserServiceWitExistingUsers = function(yarn, setupObject, callback) {
        $series([
            $task(function(flow) {
                setupUserService(yarn, setupObject, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.existingUser = setupObject.userManager.generateUser({
                    email: 'test@example.com',
                    passwordHash: '$2a$10$UCNxW7UFww9z97eijL8QhewpxjqNCjv0CoPO/PKOyjdnMdoRSnlMe'
                });
                setupObject.userManager.createUser(setupObject.existingUser, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };

    var setupUserServiceWitNoUsers = function(yarn, setupObject, callback) {
        $series([
            $task(function(flow) {
                setupUserService(yarn, setupObject, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };

    var setupUserService = function(yarn, setupObject, callback) {
        setupObject.marshRegistry.configureModule();
        setupObject.schemaManager.configureModule();
        setupObject.mongoDataStore.configureModule();
        setupObject.testCurrentUser     = yarn.weave("testAnonymousUser");
        setupObject.testSession         = yarn.weave("testSession");
        setupObject.testBetaKey         = yarn.weave("testBetaKey", [{
            betaKey: "GO_AIRBUG!"
        }]);
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
        setupObject.testMeldDocumentKey         = {};
        $series([
            $task(function(flow) {
                setupObject.blockingRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.subscriberRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.redisPubSub.initialize(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.pubSub.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.githubManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.actionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.betaKeyManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupObject.betaKeyManager.createBetaKey(setupObject.testBetaKey, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var userServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupMockSuccessPushTaskManager",
                "setupTestLogger",
                "setupTestSessionManager",
                "setupTestUserManager",
                "setupTestSessionService",
                "setupTestAirbugClientRequestPublisher",
                "setupTestGithubManager",
                "setupTestUserPusher",
                "setupTestBetaKeyService",
                "setupTestActionManager",
                "setupTestAirbugServerConfig"
            ]);
            this.testUserService    = new UserService(this.logger, this.sessionManager, this.userManager, this.sessionService, this.airbugClientRequestPublisher, this.githubManager, this.userPusher, this.betaKeyService, this.actionManager, this.airbugServerConfig);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testUserService, UserService),
                "Assert instance of UserService");
            test.assertEqual(this.testUserService.getActionManager(), this.actionManager,
                "Assert .actionManager was set correctly");
            test.assertEqual(this.testUserService.getAirbugClientRequestPublisher(), this.airbugClientRequestPublisher,
                "Assert .airbugClientRequestPublisher was set correctly");
            test.assertEqual(this.testUserService.getAirbugServerConfig(), this.airbugServerConfig,
                "Assert .airbugServerConfig was set correctly");
            test.assertEqual(this.testUserService.getBetaKeyService(), this.betaKeyService,
                "Assert .betaKeyService was set correctly");
            test.assertEqual(this.testUserService.getGithubManager(), this.githubManager,
                "Assert .githubManager was set correctly");
            test.assertEqual(this.testUserService.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testUserService.getSessionManager(), this.sessionManager,
                "Assert .sessionManager was set correctly");
            test.assertEqual(this.testUserService.getSessionService(), this.sessionService,
                "Assert .sessionService was set correctly");
            test.assertEqual(this.testUserService.getUserManager(), this.userManager,
                "Assert .userManager was set correctly");
            test.assertEqual(this.testUserService.getUserPusher(), this.userPusher,
                "Assert .userPusher was set correctly");
        }
    };

    var userServiceRegisterUserWitNonExistingEmailTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitNoUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // Test with a user that doesn't exist yet.
                    var formData = {
                        email: "test@example.com",
                        firstName: "",
                        lastName: "",
                        password: "testPassword",
                        confirmPassword: "testPassword",
                        betaKey: "GO_AIRBUG!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, $trace(function(throwable, user) {
                        if (!throwable) {
                            test.assertTrue(!!user,
                                "Assert user was generated");
                            if (user) {
                                test.assertEqual(user.getEmail(), "test@example.com",
                                    "Assert that email was set properly");
                                test.assertTrue(user.getPasswordHash() !== undefined,
                                    "Assert that password hash was generated");
                                test.assertTrue(user.getPasswordHash().length > 0,
                                    "Assert that the hash was generated");
                                test.assertEqual(user.getAnonymous(), false,
                                    "Assert user is not anonymous");
                            }
                        }
                        flow.complete(throwable);
                    }));
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitNoUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // Test with specifying an empty password
                    var formData = {
                        email: "test@example.com",
                        firstName: "",
                        lastName: "",
                        password: "",
                        confirmPassword: "",
                        betaKey: "GO_AIRBUG!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
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
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitNoUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // Test register with mismatching passwords
                    var formData = {
                        email: "test@example.com",
                        firstName: "",
                        lastName: "",
                        password: "password1",
                        confirmPassword: "password2",
                        betaKey: "GO_AIRBUG!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
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
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitExistingUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // Test with a user that already exists
                    var formData = {
                        email: "test@example.com",
                        firstName: "",
                        lastName: "",
                        password: "testPassword",
                        confirmPassword: "testPassword",
                        betaKey: "GO_AIRBUG!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
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
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitExistingUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // test login with a valid user and password
                    var email = "test@example.com";
                    var password = "lastpass";
                    _this.userService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
                        if (!throwable) {
                            test.assertTrue(throwable === null,
                                "Make sure that throwable was null");
                            test.assertTrue(!!user,
                                "Assert user was loaded");
                            test.assertEqual(user.getEmail(), "test@example.com",
                                "Assert that email was the user we expected");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitExistingUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // test login with a valid user and blank password
                    var email = "test@example.com";
                    var password = "";
                    _this.userService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
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
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitExistingUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // test login with a user that doesn't exist
                    var email = "test@plagzample.com";
                    var password = "what???";
                    _this.userService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
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
                    test.completeTest();
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
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitExistingUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    // test login with a valid user but wrong password
                    var email = "test@example.com";
                    var password = "what???";
                    _this.userService.loginUserWithEmailAndPassword(_this.testRequestContext, email, password, function(throwable, user) {
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
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };

    /*var userServiceRegisterUserWithValidBetaKeyTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitNoUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    var formData = {
                        email: "newUserOne@example.com",
                        firstName: "",
                        lastName: "",
                        password: "testPassword",
                        confirmPassword: "testPassword",
                        betaKey: "GO_AIRBUG!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                        if (!throwable) {
                            test.assertTrue(!!user,
                                "Assert user was generated");
                            if (user) {
                                test.assertEqual(user.getBetaKey(), "GO_AIRBUG!",
                                    "Assert that betaKey was set properly");
                            }
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };

    var userServiceRegisterUserWithInvalidBetaKeyTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestUserService"
            ]);
            $task(function(flow) {
                setupUserServiceWitNoUsers(yarn, _this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
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
            $series([
                $task(function(flow) {
                    var formData = {
                        email: "newUserTwo@example.com",
                        firstName: "",
                        lastName: "",
                        password: "testPassword",
                        confirmPassword: "testPassword",
                        betaKey: "GO_GO_GO!"
                    };
                    _this.userService.registerUser(_this.testRequestContext, formData, function(throwable, user) {
                        test.assertTrue(user === undefined,
                            "Assert user was not generated because the beta key is invalid");
                        test.assertTrue(!!throwable,
                            "Make sure that throwable was defined");
                        test.assertEqual(throwable.getType(), "InvalidBetaKey",
                            "Assert that the user was not created because it the beta key was invalid");
                        flow.complete();
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };*/

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(userServiceInstantiationTest).with(
        test().name("UserService - instantiation test")
    );

    bugmeta.tag(userServiceRegisterUserWitNonExistingEmailTest).with(
        test().name("UserService - register user with non-existing email test")
    );

    bugmeta.tag(userServiceRegisterUserWithEmptyPasswordTest).with(
        test().name("UserService - register user with empty password test")
    );

    bugmeta.tag(userServiceRegisterUserWithMismatchingPasswordsTest).with(
        test().name("UserService - register user with mismatching passwords test")
    );

    bugmeta.tag(userServiceRegisterUserWithExistingEmailTest).with(
        test().name("UserService - register user with existing email test")
    );

    bugmeta.tag(userServiceLoginWithValidEmailAndPasswordTest).with(
        test().name("UserService - login with valid email and password test")
    );

    bugmeta.tag(userServiceLoginWithValidEmailAndBlankPasswordTest).with(
        test().name("UserService - login with valid email and blank password test")
    );

    bugmeta.tag(userServiceLoginWithEmailThatDoesNotExistTest).with(
        test().name("UserService - login with email that does not exist test")
    );

    bugmeta.tag(userServiceLoginWithValidEmailButWrongPasswordTest).with(
        test().name("UserService - login with valid email but wrong password test")
    );

    /*bugmeta.tag(userServiceRegisterUserWithValidBetaKeyTest).with(
        test().name("UserService - register user with a valid beta key test")
    );

    bugmeta.tag(userServiceRegisterUserWithInvalidBetaKeyTest).with(
        test().name("UserService - register user with an invalid beta key test")
    );*/
});
