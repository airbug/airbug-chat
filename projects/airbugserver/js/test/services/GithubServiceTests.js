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
var UuidGenerator       = bugpack.require('UuidGenerator');
var Github              = bugpack.require('airbugserver.Github');
var GithubService       = bugpack.require('airbugserver.GithubService');
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


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupGithubService = function(setupObject) {
    setupObject.logger              = new Logger();
    setupObject.testCurrentUser     = new User({});
    setupObject.testCurrentUser.setId("testId");
    setupObject.testSession         = new Session({
        data: {
            key: 'value'
        },
        sid: UuidGenerator.generateUuid(),
        cookie: {
            expires: this.testExpires
        }
    });

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
    setupObject.testSessionManager = {
        updateSession: function(session, callback) {
            callback(undefined, session);
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
    setupObject.testGithubManager = {
        populateGithub: function(github, properties, callback) {
            github.setUser(setupObject.testCurrentUser);
            callback(undefined);
        },
        retrieveGithubId: function(callback) {
            callback(throwable, setupObject.testGithubUser.id);
        },
        retrieveGithubByGithubId: function(githubId, callback) {
            callback(undefined, setupObject.testGithub);
        }
    };
    setupObject.testGithubApi = {
        getAuthToken: function(code, callback) {
            callback(undefined, setupObject.testGithubAuthToken);
        },
        retrieveGithubUser: function(authToken, callback) {
            callback(undefined, setupObject.testGithubUser);
        }
    };
    setupObject.testUserService = {
        loginUser: function(requestContext, user, callback) {
            callback(undefined, user);
        }
    };
    setupObject.testGithubService = new GithubService(setupObject.testSessionManager,
        setupObject.testGithubManager, setupObject.testGithubApi, setupObject.testUserService);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubServiceloginUserWithGithubTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubService(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.testGithubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().githubState;
                var error = '';
                _this.testGithubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined for a valid github login");
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

var githubServiceloginUserWithGithubErrorTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubService(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.testGithubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().githubState;
                var error = 'BAD THING!';
                _this.testGithubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable !== undefined,
                        "throwable should be undefined when we get an error from github");
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

var githubServiceloginUserWithGithubStateMismatchTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubService(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.testGithubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = 'BAD STATE!';
                var error = '';
                _this.testGithubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable !== undefined,
                        "throwable should not be undefined when we have a state mismatch");
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


var githubServiceloginUserWithGithubNoGithubRecordTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubService(this);
        this.testGithub = undefined;
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.testGithubService.buildRequestContext(_this.testRequestContext, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var code = 'testCode';
                var state = _this.testSession.getData().githubState;
                var error = '';
                _this.testGithubService.loginUserWithGithub(_this.testRequestContext, code, state, error, function(throwable) {
                    test.assertTrue(throwable === undefined,
                        "throwable should be undefined when we don't find a github record in the db");
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

bugmeta.annotate(githubServiceloginUserWithGithubTest).with(
    test().name('GithubService #loginUserWithGithub Test')
);

bugmeta.annotate(githubServiceloginUserWithGithubErrorTest).with(
    test().name('GithubService #loginUserWithGithub with github error Test')
);

bugmeta.annotate(githubServiceloginUserWithGithubStateMismatchTest).with(
    test().name('GithubService #loginUserWithGithub with state mismatch Test')
);

bugmeta.annotate(githubServiceloginUserWithGithubNoGithubRecordTest).with(
    test().name('GithubService #loginUserWithGithub no github record Test')
);

