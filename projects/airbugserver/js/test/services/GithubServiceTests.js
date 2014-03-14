//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('UuidGenerator')
//@Require('airbugserver.Github')
//@Require('airbugserver.GithubService')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserService')
//@Require('bugdouble.BugDouble')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
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
var UuidGenerator       = bugpack.require('UuidGenerator');
var Github              = bugpack.require('airbugserver.Github');
var GithubService       = bugpack.require('airbugserver.GithubService');
var Session             = bugpack.require('airbugserver.Session');
var User                = bugpack.require('airbugserver.User');
var UserService         = bugpack.require('airbugserver.UserService');
var BugDouble           = bugpack.require('bugdouble.BugDouble');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn             = bugpack.require('bugyarn.BugYarn');
var Logger              = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var bugyarn             = BugYarn.context();
var spyOnObject         = BugDouble.spyOnObject;
var stubObject          = BugDouble.stubObject;
var test                = TestAnnotation.test;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupGithubService", function(yarn) {
    yarn.spin([
        "setupMockSuccessPushTaskManager",
        "setupTestLogger",
        "setupTestSessionManager",
        "setupTestGithubManager",
        "setupTestGithubApi",
        "setupTestUserService",
        "setupTestUserManager"
    ]);

    yarn.wind({
        githubService: new GithubService(this.sessionManager, this.githubManager, this.githubApi, this.userService, this.userManager)
    });
});


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupGithubService = function(yarn, setupObject, callback) {

    setupObject.schemaManager.processModule();
    setupObject.mongoDataStore.processModule();
    setupObject.testCurrentUser     = yarn.weave("testNotAnonymousUser");
    setupObject.testSession         = yarn.weave("testSession");

    setupObject.testRequestContext = {
        get: function(key) {
            if (key === 'currentUser') {
                return setupObject.testCurrentUser;
            } else if (key === 'session') {
                return setupObject.testSession;
            }
            return undefined;
        },
        set: function(key, value) {

        }
    };
    setupObject.testGithubUser = {
        id: 12345,
        login: 'dicegame'
    };
    setupObject.testGithubAuthToken = 'a1b75646f9ec91dee2dd4270f76e49ef2ebb9575';
    setupObject.testGithub = new Github({
        githubId: setupObject.testGithubUser.id,
        githubAuthToken: setupObject.testGithubAuthToken
    });
    stubObject(setupObject.githubApi, {
        getAuthToken: function(code, callback) {
            callback(undefined, setupObject.testGithubAuthToken);
        },
        retrieveGithubUser: function(authToken, callback) {
            callback(undefined, setupObject.testGithubUser);
        }
    });
    var testUser = setupObject.userManager.generateUser({
        email: 'test@example.com'
    });
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
            setupObject.userManager.createUser(setupObject.testCurrentUser, function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.userManager.createUser(testUser, function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubServiceLoginUserWithGithubTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().getGithubState();
                var error = '';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined for a valid github login");
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

var githubServiceLoginUserWithGithubErrorTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().getGithubState();
                var error = 'BAD THING!';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable !== undefined,
                        "throwable should be undefined when we get an error from github");
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

var githubServiceLoginUserWithGithubStateMismatchTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = 'BAD STATE!';
                var error = '';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable !== undefined,
                        "throwable should not be undefined when we have a state mismatch");
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


var githubServiceLoginUserWithGithubNoGithubRecordTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                _this.testGithub = undefined;
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().getGithubState();
                var error = '';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined when we don't find a github record in the db");
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


var githubServiceLoginUserWithGithubNoGithubRecordUserLoggedInTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                _this.testGithub = undefined;
                _this.testCurrentUser = new User({
                    anonymous: false
                });
                _this.testCurrentUser.setAnonymous(false);
                _this.githubManagerSpy = spyOnObject(_this.githubManager);
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().getGithubState();
                var error = '';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined");
                    test.assertTrue(_this.githubManagerSpy.getSpy("createGithub").wasCalled(),
                        "ensure that we created a new github object when the user was logged in");
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

var githubServiceLoginUserWithGithubNoGithubRecordEmailMatchesTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupGithubService"
        ]);
        $task(function(flow) {
            setupGithubService(yarn, _this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                _this.testGithub = undefined;
                _this.testGithubUser = {
                    email: 'test@example.com',
                    id: 12345,
                    login: 'dicegame'
                };
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
                _this.githubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().getGithubState();
                var error = '';
                _this.githubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined when we don't find a github record in the db");
                    var session = _this.testRequestContext.get("session");
                    var githubEmails = session.getData().getGithubEmails();
                    test.assertTrue(githubEmails !== undefined,
                        "githubEmails addresses should be stored on session");
                    if (githubEmails !== undefined) {
                        test.assertTrue(githubEmails.length === 1,
                            "there should be one email address in githubEmails");
                        test.assertEqual('test@example.com', githubEmails[0],
                            "the email address should be what we expect");
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


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(githubServiceLoginUserWithGithubTest).with(
    test().name('GithubService - #loginUserWithGithub Test')
);

bugmeta.annotate(githubServiceLoginUserWithGithubErrorTest).with(
    test().name('GithubService - #loginUserWithGithub with github error Test')
);

bugmeta.annotate(githubServiceLoginUserWithGithubStateMismatchTest).with(
    test().name('GithubService - #loginUserWithGithub with state mismatch Test')
);

bugmeta.annotate(githubServiceLoginUserWithGithubNoGithubRecordTest).with(
    test().name('GithubService - #loginUserWithGithub no github record Test')
);

bugmeta.annotate(githubServiceLoginUserWithGithubNoGithubRecordUserLoggedInTest).with(
    test().name('GithubService - #loginUserWithGithub no github record user logged in Test')
);

bugmeta.annotate(githubServiceLoginUserWithGithubNoGithubRecordEmailMatchesTest).with(
    test().name('GithubService - #loginUserWithGithub no github record github email matches user email Test')
);
