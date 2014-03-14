//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.Cookie')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionData')
//@Require('airbugserver.SessionManager')
//@Require('bugdelta.ObjectChange')
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
var Set                     = bugpack.require('Set');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var Cookie                  = bugpack.require('airbugserver.Cookie');
var Session                 = bugpack.require('airbugserver.Session');
var SessionData             = bugpack.require('airbugserver.SessionData');
var SessionManager          = bugpack.require('airbugserver.SessionManager');
var ObjectChange            = bugpack.require('bugdelta.ObjectChange');
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

bugyarn.registerWeaver("testSession", function(yarn, args) {
    yarn.spin([
        "setupTestSessionManager"
    ]);

    var sessionData     = args[0] || {};
    var testSessionData = Obj.merge(sessionData, {
        cookie: {
            domain: "testDomain",
            expires: new Date(Date.now()),
            httpOnly: false,
            path: "testPath",
            secure: false
        },
        data: {
            githubAuthToken: "testGithubAuthToken",
            githubEmails: [
                "testGithubEmail1"
            ],
            githubId: "testGithubId",
            githubLogin: "testGithubLogin",
            githubState: "testGithubState"
        },
        sid: UuidGenerator.generateUuid(),
        userId: "testUserId"
    });
    return this.sessionManager.generateSession(testSessionData);
});

bugyarn.registerWinder("setupTestSessionManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        sessionManager: new SessionManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.sessionManager.setEntityType("Session");
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var sessionManagerInstantiationTest = {

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
        this.testSessionManager   = new SessionManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSessionManager, SessionManager),
            "Assert instance of SessionManager");
        test.assertEqual(this.testSessionManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testSessionManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testSessionManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testSessionManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};

var sessionManagerGenerateSessionFullTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testCookieData         = {
            domain: "testDomain",
            expires: new Date(Date.now()),
            httpOnly: false,
            path: "testPath",
            secure: false
        };
        this.testSessionDataData    = {
            githubAuthToken: "testGithubAuthToken",
            githubEmails: [
                "testGithubEmail1"
            ],
            githubId: "testGithubId",
            githubLogin: "testGithubLogin",
            githubState: "testGithubState"
        };
        this.testSessionData        = {
            createdAt: new Date(Date.now()),
            cookie: this.testCookieData,
            data: this.testSessionDataData,
            id: "testId",
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var session = this.sessionManager.generateSession(this.testSessionData);
        test.assertTrue(Class.doesExtend(session.getCookie(), Cookie),
            "Assert .cookie was replaced with a Cookie instance");
        test.assertEqual(session.getCookie().getExpires(), this.testCookieData.expires,
            "Assert that #getCookie#getExpires is equal to testCookieData.expires");
        test.assertEqual(session.getCookie().getHttpOnly(), this.testCookieData.httpOnly,
            "Assert that #getCookie#getHttpOnly is equal to testCookieData.httpOnly");
        test.assertEqual(session.getCookie().getPath(), this.testCookieData.path,
            "Assert that #getCookie#getPath is equal to testCookieData.path");
        test.assertEqual(session.getCookie().getSecure(), this.testCookieData.secure,
            "Assert that #getCookie#getSecure is equal to testCookieData.secure");
        test.assertEqual(session.getCreatedAt(), this.testSessionData.createdAt,
            "Assert that #getCreatedAt is equal to testSessionData.createdAt value");
        test.assertEqual(session.getId(), this.testSessionData.id,
            "Assert that #getId is equal to this.testSessionData.id");
        test.assertTrue(Class.doesExtend(session.getData(), SessionData),
            "Assert .data was replaced with a SessionData instance");
        test.assertEqual(session.getData().getGithubAuthToken(),  this.testSessionDataData.githubAuthToken,
            "Assert that #getData.githubAuthToken is equal to testSessionDataData.githubAuthToken value");
        test.assertEqual(session.getData().getGithubEmails()[0],  this.testSessionDataData.githubEmails[0],
            "Assert that #getData.githubEmails[0] is equal to testSessionDataData.githubEmails[0] value");
        test.assertEqual(session.getData().getGithubId(),  this.testSessionDataData.githubId,
            "Assert that #getData.githubId is equal to testSessionDataData.githubId value");
        test.assertEqual(session.getData().getGithubLogin(),  this.testSessionDataData.githubLogin,
            "Assert that #getData.githubLogin is equal to testSessionDataData.githubLogin value");
        test.assertEqual(session.getData().getGithubState(),  this.testSessionDataData.githubState,
            "Assert that #getData.githubState is equal to testSessionDataData.githubState value");
        test.assertEqual(session.getSid(), this.testSessionData.sid,
            "Assert that #getSid is equal to testSessionData.sid value");
        test.assertEqual(session.getUpdatedAt(), this.testSessionData.updatedAt,
            "Assert that #getUpdatedAt is equal to testSessionData.updatedAt value");
        test.assertEqual(session.getUserId(), this.testSessionData.userId,
            "Assert that #getUserId is equal to testSessionData.userId value");
    }
};


var sessionManagerGenerateSessionPartialTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testCookieData         = {
            domain: "testDomain",
            expires: new Date(Date.now()),
            httpOnly: false,
            path: "testPath",
            secure: false
        };
        this.testSessionData        = {
            cookie: this.testCookieData,
            sid: UuidGenerator.generateUuid(),
            userId: "testUserId"
        };
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var session = this.sessionManager.generateSession(this.testSessionData);
        test.assertTrue(Class.doesExtend(session.getCookie(), Cookie),
            "Assert .cookie was replaced with a Cookie instance");
        test.assertEqual(session.getCookie().getExpires(), this.testCookieData.expires,
            "Assert that #getCookie#getExpires is equal to testCookieData.expires");
        test.assertEqual(session.getCookie().getHttpOnly(), this.testCookieData.httpOnly,
            "Assert that #getCookie#getHttpOnly is equal to testCookieData.httpOnly");
        test.assertEqual(session.getCookie().getPath(), this.testCookieData.path,
            "Assert that #getCookie#getPath is equal to testCookieData.path");
        test.assertEqual(session.getCookie().getSecure(), this.testCookieData.secure,
            "Assert that #getCookie#getSecure is equal to testCookieData.secure");
        test.assertTrue(TypeUtil.isDate(session.getCreatedAt()),
            "Assert that #getCreatedAt is a Date");
        test.assertEqual(session.getId(), undefined,
            "Assert that #getId is undefined");
        test.assertTrue(Class.doesExtend(session.getData(), SessionData),
            "Assert .data was replaced with a SessionData instance");
        test.assertEqual(session.getData().getGithubAuthToken(), undefined,
            "Assert that #getData.githubAuthToken is undefined");
        test.assertEqual(session.getData().getGithubEmails(), undefined,
            "Assert that #getData.githubEmails is undefined");
        test.assertEqual(session.getData().getGithubId(), undefined,
            "Assert that #getData.githubId is undefined");
        test.assertEqual(session.getData().getGithubLogin(), undefined,
            "Assert that #getData.githubLogin is undefined");
        test.assertEqual(session.getData().getGithubState(), undefined,
            "Assert that #getData.githubState is undefined");
        test.assertEqual(session.getSid(), this.testSessionData.sid,
            "Assert that #getSid is equal to testSessionData.sid value");
        test.assertTrue(TypeUtil.isDate(session.getUpdatedAt()),
            "Assert that #getUpdatedAt is a Date");
        test.assertEqual(session.getUserId(), this.testSessionData.userId,
            "Assert that #getUserId is equal to testSessionData.userId value");
    }
};

var sessionManagerCreateTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testSessionData        = {
            cookie: {
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            },
            data: {
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            },
            sid: UuidGenerator.generateUuid(),
            userId: "testUserId"
        };
        this.testSession            = yarn.weave("testSession", [this.testSessionData]);
        $series([
            $task(function(flow) {
                _this.sessionManager.initializeModule(function(throwable) {
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
        $series([
            $task(function(flow) {
                _this.sessionManager.createSession(_this.testSession, function(throwable) {
                    if (!throwable) {
                        test.assertEqual(_this.testSession.getCookie().getExpires(), _this.testSessionData.cookie.expires,
                            "Assert that expires is equal to testSessionData.cookie.expires");
                        test.assertEqual(_this.testSession.getCookie().getHttpOnly(), _this.testSessionData.cookie.httpOnly,
                            "Assert that #getHttpOnly is equal to testSessionData.cookie.httpOnly");
                        test.assertEqual(_this.testSession.getCookie().getPath(), _this.testSessionData.cookie.path,
                            "Assert that #getPath is equal to testSessionData.cookie.path");
                        test.assertEqual(_this.testSession.getCookie().getSecure(), _this.testSessionData.cookie.secure,
                            "Assert that #getSecure is equal to testSessionData.cookie.secure");
                        test.assertTrue(TypeUtil.isDate(_this.testSession.getCreatedAt()),
                            "Assert that #getCreatedAt returns a Date");
                        test.assertTrue(!!_this.testSession.getId(),
                            "Assert created Session has an id");
                        test.assertEqual(_this.testSession.getData().getGithubAuthToken(),  _this.testSessionData.data.githubAuthToken,
                            "Assert that #getData.githubAuthToken is equal to testSessionData.data.githubAuthToken value");
                        test.assertEqual(_this.testSession.getData().getGithubEmails()[0],  _this.testSessionData.data.githubEmails[0],
                            "Assert that #getData.githubEmails[0] is equal to testSessionData.data.githubEmails[0] value");
                        test.assertEqual(_this.testSession.getData().getGithubId(),  _this.testSessionData.data.githubId,
                            "Assert that #getData.githubId is equal to testSessionData.data.githubId value");
                        test.assertEqual(_this.testSession.getData().getGithubLogin(),  _this.testSessionData.data.githubLogin,
                            "Assert that #getData.githubLogin is equal to testSessionData.data.githubLogin value");
                        test.assertEqual(_this.testSession.getData().getGithubState(),  _this.testSessionData.data.githubState,
                            "Assert that #getData.githubState is equal to testSessionData.data.githubState value");
                        test.assertEqual(_this.testSession.getSid(), _this.testSessionData.sid,
                            "Assert that #getSid is equal to testSessionData.sid value");
                        test.assertEqual(_this.testSession.getUserId(), _this.testSessionData.userId,
                            "Assert that #getUserId is equal to testSessionData.userId value");
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

var sessionManagerCreateAndUpdateTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testCookieData         = {
            domain: "testDomain",
            expires: new Date(Date.now() + 1000),
            httpOnly: false,
            path: "testPath",
            secure: false
        };
        this.testSessionDataData     = {
            githubAuthToken: "testGithubAuthToken",
            githubEmails: [
                "testGithubEmail1"
            ],
            githubId: "testGithubId",
            githubLogin: "testGithubLogin",
            githubState: "testGithubState"
        };
        this.testSessionData        = {
            cookie: this.testCookieData,
            data: this.testSessionDataData,
            sid: UuidGenerator.generateUuid(),
            userId: "testUserId"
        };
        this.testGithubAuthTokenUpdate = "testGithubAuthTokenUpdate";
        this.testSession            = yarn.weave("testSession", [this.testSessionData]);
        $series([
            $task(function(flow) {
                _this.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        })
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.sessionManager.createSession(_this.testSession, function(throwable) {
                    if (!throwable) {
                        test.assertTrue(!!_this.testSession.getId(),
                            "Assert created Session has an id");
                        test.assertEqual(_this.testSession.getData().getGithubAuthToken(), _this.testSessionDataData.githubAuthToken,
                            "Assert that Session.data.githubAuthToken is equal to testSessionData.data.githubAuthToken value");
                        test.assertEqual(_this.testSession.getCookie().getExpires(), _this.testCookieData.expires,
                            "Assert that expires is equal to testExpires");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.retrieveSession(_this.testSession.getId(), function(throwable, retrievedSession) {
                    if (!throwable) {
                        test.assertEqual(retrievedSession.getData().getGithubAuthToken(), _this.testSessionDataData.githubAuthToken,
                            "Assert that Session.data.githubAuthToken is equal to testSessionData.data.githubAuthToken value");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.testSession.getData().setGithubAuthToken(_this.testGithubAuthTokenUpdate);
                _this.sessionManager.updateSession(_this.testSession, function(throwable) {
                    if (!throwable) {
                        test.assertTrue(!!_this.testSession.getId(),
                            "Assert updated Session has an id");
                        test.assertEqual(_this.testSession.getData().getGithubAuthToken(), _this.testGithubAuthTokenUpdate,
                            "Assert that Session.data.githubAuthToken is equal to testGithubAuthTokenUpdate after update call");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.retrieveSession(_this.testSession.getId(), function(throwable, retrievedSession) {
                    if (!throwable) {
                        test.assertEqual(retrievedSession.getData().getGithubAuthToken(), _this.testGithubAuthTokenUpdate,
                            "Assert that newly retrieved Session.data.githubAuthToken is equal to testGithubAuthTokenUpdate");
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

var sessionManagerConvertEntityToDbObjectTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testSessionData        = {
            cookie: {
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            },
            createdAt: new Date(Date.now()),
            data: {
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            },
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.expectedSessionData    = Obj.clone(this.testSessionData, true);
        this.testSession            = yarn.weave("testSession", [this.testSessionData]);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var dbObject = this.sessionManager.convertEntityToDbObject(this.testSession);
        var expectedResult = JSON.stringify(this.expectedSessionData, null, "\t");
        test.assertEqual(JSON.stringify(dbObject, null, "\t"), expectedResult,
            "Asset result is the testData");
    }
};


var sessionManagerBuildUpdateObjectTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testSessionData        = {
            cookie: {
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            },
            createdAt: new Date(Date.now()),
            data: {
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            },
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.expectedSessionData    = Obj.clone(this.testSessionData, true);
        this.testSession            = yarn.weave("testSession", [this.testSessionData]);
        this.testSession.commitDelta();
        this.testSession.getCookie().setHttpOnly(true);
        this.testSession.getData().setGithubId("testUpdateGithubId");
        this.testSession.setSid("testUpdateSid");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var updateObject = this.sessionManager.buildUpdateObject(this.testSession);
        var expectedUpdateObject = {
            "$set": {
                sid: "testUpdateSid",
                "data.githubId": "testUpdateGithubId",
                "cookie.httpOnly":true
            }
        };
        var expectedResult  = JSON.stringify(expectedUpdateObject, null, "\t");
        test.assertEqual(JSON.stringify(updateObject, null, "\t"), expectedResult,
            "Asset expected updateObject");
    }
};

var sessionManagerBuildDeltaObjectTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSessionManager"
        ]);
        this.schemaManager.processModule();
        this.mongoDataStore.processModule();

        this.testSessionData        = {
            cookie: {
                domain: "testDomain",
                expires: new Date(Date.now()),
                httpOnly: false,
                path: "testPath",
                secure: false
            },
            createdAt: new Date(Date.now()),
            data: {
                githubAuthToken: "testGithubAuthToken",
                githubEmails: [
                    "testGithubEmail1"
                ],
                githubId: "testGithubId",
                githubLogin: "testGithubLogin",
                githubState: "testGithubState"
            },
            sid: UuidGenerator.generateUuid(),
            updatedAt: new Date(Date.now()),
            userId: "testUserId"
        };
        this.expectedSessionData    = Obj.clone(this.testSessionData, true);
        this.testSession            = yarn.weave("testSession", [this.testSessionData]);
        this.testSession.commitDelta();
        this.testSession.getCookie().setHttpOnly(true);
        this.testSession.getData().setGithubId("testUpdateGithubId");
        this.testSession.setSid("testUpdateSid");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var delta = this.entityDeltaBuilder.buildDelta(this.testSession.getDeltaDocument(),
            this.testSession.getDeltaDocument().getPreviousDocument());

        test.assertEqual(delta.getChangeCount(), 3,
            "Assert 3 changes");
        var expectedPropertySet = new Set([
            "cookie.httpOnly",
            "data.githubId",
            "sid"
        ]);
        var changeList = delta.getDeltaChangeList();
        changeList.forEach(function(deltaChange) {
            test.assertTrue(Class.doesExtend(deltaChange, ObjectChange),
                "Assert ObjectChange");
            expectedPropertySet.remove(deltaChange.getPropertyPath());
        });
        test.assertTrue(expectedPropertySet.isEmpty(),
            "Assert all of the expected properties were found");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(sessionManagerInstantiationTest).with(
    test().name("SessionManager - instantiation test")
);

bugmeta.annotate(sessionManagerGenerateSessionFullTest).with(
    test().name("SessionManager - #generateSession full test")
);

bugmeta.annotate(sessionManagerGenerateSessionPartialTest).with(
    test().name("SessionManager - #generateSession partial test")
);

bugmeta.annotate(sessionManagerCreateTest).with(
    test().name("SessionManager - create session test")
);

bugmeta.annotate(sessionManagerCreateAndUpdateTest).with(
    test().name("SessionManager - create and update session test")
);

bugmeta.annotate(sessionManagerConvertEntityToDbObjectTest).with(
    test().name("SessionManager - #convertEntityToDbObject test")
);

bugmeta.annotate(sessionManagerBuildUpdateObjectTest).with(
    test().name("SessionManager - #buildUpdateObject test")
);

bugmeta.annotate(sessionManagerBuildDeltaObjectTest).with(
    test().name("SessionManager - #buildDelta test")
);